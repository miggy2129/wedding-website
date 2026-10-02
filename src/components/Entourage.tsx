import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"

const PRIESTS = [
  "Rev. Fr. Edmundo A. Tiamson, OFM Cap.", "Rev. Fr. Mark Joseph Santos Lorenzo"
];

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
  ['Rochelle Ann Siy', 'Adrian Reyes'],
  ['', 'Julian Bagatsing']
];

const SPECIAL_SPONSORS = [
  [
    'Katrina Camille Peña',
    'Janine Bulseco',
    'Bea Korina Madrid'
  ],
   [
    'Jheric de los Angeles',
    'Cyrill Chan',
    'Laurence Kristoffer Espiritu'
  ]
];

export default function Entourage() {
  return (
    <section id="entourage" className="py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#2C2C2C] mb-3">
          Entourage
        </h2>

        <div className="my-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2}>
                  <u>Officiating Priests</u>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {PRIESTS.map((priest, i) => (
                    <TableCell key={i}>{priest}</TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <u>Parents of the Bride</u>
                </TableHead>
                <TableHead>
                  <u>Parents of the Groom</u>
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
        
        <div className="mt-6 mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2}>
                  <u>Principal Sponsors</u>
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

        <div className="mt-6 mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <u>Maids of Honor</u>
                </TableHead>
                <TableHead>
                  <u>Best Man</u>
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

        <div className="my-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <u>Bridesmaids</u>
                </TableHead>
                <TableHead>
                  <u>Groomsmen</u>
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

        <div className="mt-6 mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={3}>
                  <u>Special Roles</u>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-lg font-serif text-[#588FE1] font-bold pb-0">
                  candle
                </TableCell>
                <TableCell className="text-lg font-serif text-[#588FE1] font-bold pb-0">
                  veil
                </TableCell>
                <TableCell className="text-lg font-serif text-[#588FE1] font-bold pb-0">
                  cord
                </TableCell>
              </TableRow>
              {SPECIAL_SPONSORS.map((group, i) => (
                <TableRow key={i}>
                  {group.map((person, groupIndex) => (
                    <TableCell key={groupIndex}>
                      {person}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="text-lg font-serif text-[#588FE1] font-bold pb-0 pt-5">
                  coin & bible bearer
                </TableCell>
                <TableCell className="text-lg font-serif text-[#588FE1] font-bold pb-0 pt-5">
                  ring bearer
                </TableCell>
                <TableCell className="text-lg font-serif text-[#588FE1] font-bold pb-0 pt-5">
                  flower girls
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Rafael Mercado
                </TableCell>
                <TableCell>
                  Jess Augustus Bulseco
                </TableCell>
                <TableCell>
                  Thalisse Celeste Magsaysay
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  Lily Alexandria Salvador
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

      </div>
    </section>
  );
}