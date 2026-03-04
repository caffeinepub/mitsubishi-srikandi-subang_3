import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useGetAllCreditSimulations } from "../../hooks/useCreditSimulations";

export default function CreditSimulationsPage() {
  const { data: simulations, isLoading } = useGetAllCreditSimulations();

  const sortedSimulations = simulations
    ? [...simulations].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Simulasi Kredit</h1>
        <p className="text-muted-foreground">
          Daftar simulasi kredit dari pengunjung
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Simulasi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {["s1", "s2", "s3", "s4", "s5"].map((key) => (
                <Skeleton key={key} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Kendaraan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tenor (Bulan)</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSimulations && sortedSimulations.length > 0 ? (
                  sortedSimulations.map((sim) => (
                    <TableRow key={sim.id.toString()}>
                      <TableCell>{sim.vehicleId.toString()}</TableCell>
                      <TableCell>
                        Rp {Number(sim.amount).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>{sim.term.toString()} bulan</TableCell>
                      <TableCell>
                        {format(
                          new Date(Number(sim.timestamp) / 1000000),
                          "dd/MM/yyyy HH:mm",
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
