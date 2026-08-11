const text = `SEKSYON 1: PANGKALAHATANG TUNTUNIN
Ang lahat ng uri ng sasakyan na bumibiyahe sa loob ng nasasakupan ng barangay ay ipinagbabawal na gumamit ng muffler na nagdudulot ng labis na ingay. Higit lalo na sa mga pangunahing mga lugar;
- Paaralan
- Pribadong Establisyemento
- Barangay Hall
- Simbahan
- Pagamutan

SEKSYON 2: DEPINISYON NG MAINGAY NA MUFFLER
Ang 'maingay na muffler' ay tinutukoy bilang anumang bahagi ng Sistema ng tambutso ng sasakyan na nagiging sanhi ng tunog na higit sa 80 decibels.
- Chicken Pipe
- Mga tambutso na iminodified
- Improvised muffler

SEKSYON 3: KALAKIP NA PARUSA
Unang Paglabag: Ipaalis sa kaniya ang nasabing muffler ora mismo / Pagmumultahin ng halagang P500 piso
Pangalawang Paglabag: Pagmumultahin ng halagang P1,000 piso
Pangatlong Paglabag: Kukumpiskahin ng Tanggapan ang nasabing Muffler

Ang mga paulit-ulit na paglabag ay maaring magresulta sa mas mataas na multa o di kaya naman ay maaaring ireport sa tanggapan ng Land Transportation Office (LTO) kasama ang Blotter sa barangay.

SEKSYON 4: MGA TUNGKULIN NG ALAGAD NG BARANGAY
Ang mga alagad ng barangay ay may karapatang humingi ng kopya ng papel may-ari ng motor (OR & CR) na pagkikilanlan ng nasabing sasakyan para nasabing blotter.`;

const regex = /(?:^|\n)(?:#{1,3}\s*)?((?:SECTION|SEKSYON|ARTICLE|ARTIKULO)\s+(?:\d+|[IVXLCDM]+))([\s\S]*?)(?=(?:\n(?:#{1,3}\s*)?(?:SECTION|SEKSYON|ARTICLE|ARTIKULO)\s+(?:\d+|[IVXLCDM]+)|\s*$))/gi;

let match;
while ((match = regex.exec(text)) !== null) {
  console.log('MATCH:', match[1]);
  
  let rawContent = match[2].trim();
  const lines = rawContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let title = '';
  if (lines.length > 0 && lines[0].length < 150 && !lines[0].endsWith('.')) {
    title = lines[0].replace(/^[-–—.:\s]+/, '').trim();
    rawContent = lines.slice(1).join('\n');
  } else {
    rawContent = lines.join('\n');
  }

  const paragraphs = rawContent.split(/\n/);
  const uniqueParas = Array.from(new Set(paragraphs));
  const content = uniqueParas.join('\n').trim();
  console.log('Title:', title);
  console.log('Content:', content);
}
