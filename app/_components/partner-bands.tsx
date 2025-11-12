import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

const brands = [
  { name: "Nike", icon: "/nike-icon.svg" },
  { name: "Adidas", icon: "/adidas-icon.svg" },
  { name: "Puma", icon: "/puma-icon.svg" },
  { name: "New Balance", icon: "/new-balance-icon.svg" },
  { name: "Converse", icon: "/conver-icon.svg" },
  { name: "Zara", icon: "/zara-icon.svg" },
  { name: "Polo", icon: "/polo-icon.svg" },
];

export function PartnerBands() {
  return (
    <div>
      <h2 className="mb-8 px-5 font-semibold md:px-11 md:text-2xl">
        Marcas parceiras
      </h2>

      {/* Carousel para telas menores que xl */}
      <div className="xl:hidden">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 px-5 md:px-11">
            {brands.map((brand) => (
              <CarouselItem
                key={brand.name}
                className="basis-1/4 md:basis-1/4 lg:basis-1/6"
              >
                <div className="z-50 flex h-20 w-20 cursor-grab items-center justify-center rounded-2xl border bg-white p-4 transition-all hover:shadow-md md:h-28 md:w-40">
                  <div className="relative h-8 w-8 md:h-12 md:w-12">
                    <Image src={brand.icon} alt={brand.name} fill />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Flex layout para telas xl e maiores */}
      <div className="hidden px-11 xl:flex xl:items-center xl:justify-between">
        {brands.map((brand) => (
          <div className="flex flex-col items-center gap-4">
            <div
              key={brand.name}
              className="flex h-28 w-44 items-center justify-center rounded-3xl border bg-white p-4 transition-all hover:shadow-md"
            >
              <div className="relative h-12 w-12">
                <Image src={brand.icon} alt={brand.name} fill />
              </div>
            </div>
            <h1 className="font-medium">{brand.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
