export default function SpecialFeatures() {
  const features = [
    {
      icon: '/assets/generated/icon-flexible-installments.dim_128x128.png',
      title: 'Angsuran Ringan',
      description: 'Cicilan terjangkau dengan tenor fleksibel hingga 5 tahun',
    },
    {
      icon: '/assets/generated/icon-low-downpayment.dim_128x128.png',
      title: 'DP Rendah',
      description: 'Down payment mulai dari 10% saja',
    },
    {
      icon: '/assets/generated/icon-negotiable-price.dim_128x128.png',
      title: 'Nego Sampai Deal',
      description: 'Harga terbaik dan bisa dinegosiasikan',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#C90010]">Keunggulan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-24 h-24 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
