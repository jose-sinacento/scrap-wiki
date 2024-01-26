const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';
const internalPageUrl = 'https://es.wikipedia.org';

app.get('/', (req, res) => {
    // 1) Load URL
    axios.get(url).then((response) => {
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);

            const pageTitle = $('title').text();
            const imgs = [];
            const texts = [];

            // const $a = $('a.mv-category-group');
            // console.log($a)

            $('img').each((index, element) => {
                const img = $(element).attr('src')
                imgs.push(img)
            })
            $('p').each((index, element) => {
                const text = $(element).attr('p')
                texts.push(text)
            })

            // Acceso a los cantantes (links de las páginas internas de la página padre, que es la página de la categoría)
            $('#mw-pages a').each((index, element) => {    
                const href = $(element).attr('href');

                axios.get(internalPageUrl + href).then((response) => {
                    if (response.status === 200) {
                        const html = response.data;
                        const $ = cheerio.load(html);
                        
                        const objSingers = [
                            {
                                title: $('title').text(),
                                images: [$('img').attr('src')],
                                texts: [$('p').text()]
                            }
                        ];
                        console.log(objSingers);
                    }
                });


            })
        

            /*
            [
               {
                   title: '2 Chainz',
                   images: [
                       'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/2_Chainz_at_Pretty_Girls_Like_Trap_Music_Tour.jpg/200px-2_Chainz_at_Pretty_Girls_Like_Trap_Music_Tour.jpg'
                   ],
                   paragrahps: [
                       '<p><b>Tauheed K. Epps</b> (<a href="/wiki/College_Park_(Georgia)" title="College Park (Georgia)">College Park (Georgia)</a>, 12 de septiembre de 1977) conocido bajo su nombre artístico <b>2 Chainz</b> (anteriormente <b>Tity Boi</b>), es un rapero <a href="/wiki/Estados_Unidos" title="Estados Unidos">estadounidense</a> nacido y criado en <a href="/wiki/College_Park_(Georgia)" title="College Park (Georgia)">College Park</a>, <a href="/wiki/Georgia_(Estados_Unidos)" title="Georgia (Estados Unidos)">Georgia</a>, el cual empezó a ganar fama siendo miembro del grupo de hip-hop sureño <a href="/w/index.php?title=Playaz_Circle&amp;action=edit&amp;redlink=1" class="new" title="Playaz Circle (aún no redactado)">Playaz Circle</a>, junto a <a href="/w/index.php?title=Dolla_Boy&amp;action=edit&amp;redlink=1" class="new" title="Dolla Boy (aún no redactado)">Dolla Boy</a>. Luego comenzó a grabar para el sello discográfico <a href="/wiki/Def_Jam_Records" class="mw-redirect" title="Def Jam Records">Def Jam Records</a>.<sup id="cite_ref-1" class="reference separada"><a href="#cite_note-1"><span class="corchete-llamada">[</span>1<span class="corchete-llamada">]</span></a></sup>​</p>',
                        '<p>Entre 1995 y 1997, antes de desarrollar su carrera como músico, Epps jugó al baloncesto en la posición de <a href="/wiki/Alero_(baloncesto)" title="Alero (baloncesto)">alero</a> para los <a href="/wiki/Alabama_State_Hornets" title="Alabama State Hornets">Alabama State Hornets</a>, un equipo que forma parte de la <a href="/wiki/Southwestern_Athletic_Conference" title="Southwestern Athletic Conference">Southwestern Athletic Conference</a> de la <a href="/wiki/Divisi%C3%B3n_I_de_la_NCAA" title="División I de la NCAA">División I de la NCAA</a>. Promedió 2.6 puntos y 1.6 rebotes por partido en 35 juegos.<sup id="cite_ref-2" class="reference separada"><a href="#cite_note-2"><span class="corchete-llamada">[</span>2<span class="corchete-llamada">]</span></a></sup>​</p>'
                   ]
               }
            ]
            */

            res.send(`
            <h1>${pageTitle}</h1>
            <h2>Imágenes</h2>
                <ul>
                    ${imgs.map(img => `<li><a href="${url}${img}">${img}</a></li>`).join(" ")}
                </ul>
            <h2>Textos</h2>
                <ul>
                    ${texts.map(text => `<li>${text}</li>`).join(" ")}
                </ul>
            `)
        }
    })
})

const port = 3000;
app.listen(port, () => {
    console.log(`express está escuchando en el puerto http://localhost:${port}`)
})