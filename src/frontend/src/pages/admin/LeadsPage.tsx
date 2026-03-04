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
import { useGetAllContactSubmissions } from "../../hooks/useContacts";

export default function LeadsPage() {
  const { data: contacts, isLoading } = useGetAllContactSubmissions();

  const sortedContacts = contacts
    ? [...contacts].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Leads / Kontak Masuk
        </h1>
        <p className="text-muted-foreground">
          Daftar kontak yang masuk dari website
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kontak</CardTitle>
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
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Pesan</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedContacts && sortedContacts.length > 0 ? (
                  sortedContacts.map((contact) => (
                    <TableRow key={contact.id.toString()}>
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {contact.message}
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(Number(contact.timestamp) / 1000000),
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
