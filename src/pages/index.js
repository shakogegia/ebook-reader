import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>

      <div className='w-[500px] h-[600px] border border-dashed p-5 rounded-lg font-mono overflow-scroll'>
        <p className='text-2xl my-2'>Title</p>
        <p></p>
        <p>
          Mijn moeder is zevenenzeventig en woont sinds enkele weken in Autumn Palace. De naam van het bejaardencentrum verwijst naar de herfst omdat de meeste bewoners tot de derde leeftijd behoren. Voor de vierde leeftijd bestaan andere instellingen, die echter ook geen ‘winter’ in hun naam dragen; winter doet aan de dood denken en dat mag niet. Herfst impliceert kleurenrijkdom, levenservaring.
        </p>
        <p>
          In de auto, onderweg naar Autumn Palace, noemde mijn moeder de gedachtegang rond die naamgeving herhaaldelijk hypocriet. Hoewel ze zelf op een verhuizing naar het centrum had aangedrongen, zag ze er nu tegen op en ging ze zelfs zo ver te beweren dat ik haar had gedwongen. Dat was te verwachten. Een aanzienlijkdeel van haar leven bracht mijn moeder door in een roes van furieuze verontwaardiging, zelfmedelijden en een energiek soort doodsdrift. Omdat ze daarnaast ook smaak en gevoel voor humor heeft, soms lief kan zijn en oud is, beet ik op mijn tong en bleef ik mijn aandacht onafgebroken op de weg richten. Ik zou haar niet naar het hoofd slingeren wat dat verblijf me zou kosten. Ze mocht zich geen last voelen, en niet de kans krijgen mij van gierigheid te betichten. 
        </p>
        <p>
          Zelf voelde ik me echter ook opgelaten. Ik moest aan haar vergeetachtigheid van de laatste maanden denken, om er opnieuw van overtuigd te raken dat ze niet zelfstandig kon blijven wonen. Al sinds haar veertigste zei ze symptomen van de ziekte van Alzheimer bij zichzelf te ontdekken, maar sinds kort leken die niet langer voorgewend. Ik had een dozijn beschimmelde ontbijtkoeken en een dode koolmees tussen de wintertruien in haar kleerkast gevonden. Ze had woedend gereageerd toen ik haar erop had gewezen, en met een verward verhaal had ze geprobeerd mijn man als verantwoordelijke aan te wijzen. Ze had hem nooit gemogen, hij haar evenmin. Tijdens mijn volgende bezoek was ze tot mijn verbazing, en opluchting, echter zelf over het bejaardencentrum begonnen.
        </p>
        <p>
          Het kon niet anders. Ik wist het, zij wist het. Wat me vooral ongemakkelijk stemde was dat ik haar nieuwe onderkomen niet vooraf had bezocht, omdat ze aanvankelijk toch enthousiast was geweest en ik het druk had. Ik kende het centrum enkel van een 3D-presentatie op het internet. Het zinnetje: ‘Elke kamer met eigen hulp (AI)’ had zich sindsdien met weerhaakjes in mijn geest verankerd. Omdat ik vermoedde dat het vooruitzicht op een eigen meid mijn moeders voorkeur voor Autumn Palace verklaarde, besloot ik haar niet te vertellen dat die AI volgens mij voor Artificiële Intelligentie stond. Ik had er weleens een documentaire over gezien. Nadat een tekort aan arbeidskrachten de zorgsector een halve eeuw lang stukje bij beetje had uitgehold en een schokkend aantal door verplegend personeel vergeten bejaarden dood op toiletpotten was teruggevonden, had Europa het laatste decennium sterk geïnvesteerd in robots om het werk op te knappen. De nieuwe modellen waren naar verluidt ver verwijderd van de houterige huisdieren en het personeel uit de eerste experimenten. De ouderen zouden er goed op reageren. Het heette een kwestie van gezelschap te zijn.
        </p>
      </div>
    </main>
  )
}
