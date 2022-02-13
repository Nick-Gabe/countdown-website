const selectedDate = document.getElementById('selectedDate'),
    counter = {
        ayears: document.getElementById('years'),
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
    },
    title = document.getElementById('countdown__title'),
    yearContainer = document.getElementById('yearContainer'),
    countdownContainer = document.getElementById('countdownContainer')
let timer, titleOptions = ['counting since', 'counting to'], copyOptions = 'link copied!'

function verifyQuery() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      let date = new Date(!!params.ts || isNaN(params.ts) ? params.ts*1000 : '2023-01-01T00:00') 
      console.log('🧞‍♂️', date)

      function dateToText(date, max = 2, plus = 0) {
          date+=plus

          if(max >= 4 && date < 10) {
            return '000' + date
          }
          else if(max >= 4 && date < 100) {
            return '00' + date
          }
          else if(max >= 4 && date < 1000) {
            return '0' + date
          }
          else if(max >= 2 && date < 10) {
              return '0' + date
          }
          return date
      }

      selectedDate.value = 
      `${dateToText(date.getFullYear(), 4)}`+
      `-${dateToText(date.getMonth(), 2, 1)}`+
      `-${dateToText(date.getDate())}`+
      `T${dateToText(date.getHours())}:`+
      `${dateToText(date.getMinutes())}`
}
verifyQuery()

function countSecond() {
    function format(restingTime) {
        let yyyy = Math.floor(restingTime / 31556952)
        dd = Math.floor(restingTime % 31556952 / 86400),
        hh = Math.floor(restingTime % 31556952 % 86400 / 3600),
        mm = Math.floor(restingTime % 31556952 % 86400 % 3600 / 60),
        ss = Math.floor(restingTime % 31556952 % 86400 % 3600 % 60)
        return [Math.abs(yyyy).toLocaleString(), Math.abs(dd), Math.abs(hh), Math.abs(mm), Math.abs(ss)]
    }

    const unix = Date.now()
    const selected = new Date(selectedDate.value).getTime()
    let restingTime = (selected < unix ? unix - selected : selected - unix) / 1000

    if(selected < unix) {
        title.textContent = titleOptions[0]
    } else {
        title.textContent = titleOptions[1]
    }
    let actualTime = format(restingTime)

    if(actualTime[0] > 0) {
        yearContainer.classList.remove('d-none')
        counter.ayears.textContent = actualTime[0]
        countdownContainer.classList.add('withYear')
    } else {
        yearContainer.classList.add('d-none')
        countdownContainer.classList.remove('withYear')
    }

    counter.days.textContent = actualTime[1]
    counter.hours.textContent = actualTime[2]
    counter.minutes.textContent = actualTime[3]
    counter.seconds.textContent = actualTime[4]
}

async function startCounting() {
    let hasStarted = false
    
    while (!hasStarted) {
        if(new Date().getMilliseconds() === 0) {
            hasStarted = true
            countSecond()
            setInterval(() => {
                countSecond()
            }, 1000)
        }
    }

}
startCounting()

async function copyToClipboard() {
    await navigator.clipboard.writeText(`${document.URL.split('?')[0]}?ts=${new Date(selectedDate.value).getTime() / 1000}`)

    const element =  document.querySelector('footer > h2')
    let previousText = element.textContent
    let clickedText = 'link copied!'
    if (previousText === clickedText) return

    element.textContent = clickedText
    element.style.transform = 'scale(1.1)'
    setTimeout(() => {
        element.textContent = previousText
        element.style.transform = 'scale(1)'
    }, 2000)
}

function share(platform) {
    const websiteUrl = encodeURI(`${document.URL.split('?')[0]}?ts=${new Date(selectedDate.value).getTime() / 1000}`)
    const links = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURI('Come follow this countdown with me: ') + websiteUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${websiteUrl}&amp;src=sdkpreparse`
    }
    
    window.open(links[platform])
}

function translatePage() {
    const lang = navigator.language || navigator.userLanguage

    console.log('🖕', lang)
    const languages = {
        ['pt-BR']() {
            titleOptions = ['Contando desde', 'Contagem para']
            let measures = ['anos', 'dias', 'horas', 'minutos', 'segundos']
            document.querySelectorAll('.number').forEach((element, i) => {
                element.setAttribute('data-name', measures[i])
            })
            document.querySelector('footer > h2').textContent = 'Compartilhe essa contagem'
            copyOptions = 'link copiado!'
            document.querySelector('.credits').innerHTML = 'feito por <a href="https://www.github.com/Nick-Gabe" target="_blank">Nick Gabe</a>.'
        }
    }
    languages[lang] && languages[lang]()
}
translatePage()