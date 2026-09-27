import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"

const FATHERS = [
  "Judo Sonaco (+)", "Eugenio Mercado"
];

const MOTHERS = [
  "Ruth Miclat-Sonaco", "Angelita Mercado"
]

const PRINCIPAL_SPONSORS = [
  ['Brian Villas', 'Maricris Mendoza-Pasoquin'],
  ['Desiderio Laperal', 'Ma. Edwina Laperal'],
  ['Jaime Amiel Pahati', 'Elaina Kristine Pahati'],
  ['Jose Alberto Alba', 'Maria Consuelo Lukban']
];

const GROOMSMEN_BRIDESMAIDS = [
  ['Katrina Ruth Sonaco-Antig', 'Alejandro Luis Sia'],
  ['Kerima Ruth Sonaco', 'Ryan Christopher Abis'],
  ['Katrina Abenojar', 'Elijah Bryce Mojares'],
  ['Melissa Anne Regala', 'Joaquin Nicolas Mercado'],
  ['Angela Bettina Mercado', 'Jaime Magsaysay'],
  ['Rowhe Rodriguez-Siy', 'Adrian Reyes'],
  ['', 'Julian Bagatsing']
];

const CANDLE_SPONSORS = [
  'Katrina Camille Peña',
  'Jheric de los Angeles'
];

const VEIL_SPONSORS = [
  'Bea Korina Madrid',
  'Laurence Kristoffer Espiritu'
];

const CORD_SPONSORS = [
  'Janine Bulseco',
  'Cyrill Chan'
];

const FLOWER_GIRLS = [
  'Lily Alexandria Salvador',
  'Tali Magsaysay' 
];

export default function Events() {
  return (
    <section id="entourage" className="py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-3">
          Entourage
        </h2>

        <div className="mt-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead>
                  Parents of the Bride
                </TableHead>
                <TableHead>
                  Parents of the Groom
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {FATHERS.map((father, i) => (
                    <TableCell key={i}>{father}</TableCell>
                  ))}
              </TableRow>
              <TableRow>
                {MOTHERS.map((mother, i) => (
                    <TableCell key={i}>{mother}</TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead colSpan={2}>
                  Principal Sponsors
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRINCIPAL_SPONSORS.map((pair, rowIndex) => (
                <TableRow key={rowIndex}>
                  {pair.map((person, i) => (
                      <TableCell key={i}>{person}</TableCell>
                    ))}
                </TableRow>
              ))}
              
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead>
                  Maids of Honor
                </TableHead>
                <TableHead>
                  Best Man
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  Margarita Julienne Luna
                </TableCell>
                <TableCell>
                  Miguel David Laperal
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Anna Dominica Tapel-de los Angeles</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead>
                  Bridesmaids
                </TableHead>
                <TableHead>
                  Groomsmen
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GROOMSMEN_BRIDESMAIDS.map((pair, rowIndex) => (
                <TableRow key={rowIndex}>
                  {pair.map((person, i) => (
                      <TableCell key={i}>{person}</TableCell>
                    ))}
                </TableRow>
              ))}
              
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead colSpan={2}>
                  Candle Sponsors
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {CANDLE_SPONSORS.map((member, i) => (
                    <TableCell key={i}>{member}</TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead colSpan={2}>
                  Veil Sponsors
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {VEIL_SPONSORS.map((member, i) => (
                    <TableCell key={i}>{member}</TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead colSpan={2}>
                  Cord Sponsors
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {CORD_SPONSORS.map((member, i) => (
                    <TableCell key={i}>{member}</TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead colSpan={2}>
                  Flower Girls
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {FLOWER_GIRLS.map((member, i) => (
                    <TableCell key={i}>{member}</TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead>
                  Coin and Bible Bearer
                </TableHead>
                <TableHead>
                  Ring Bearer
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Rafael Mercado</TableCell>
                <TableCell>Jess Augustus Bulseco</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}