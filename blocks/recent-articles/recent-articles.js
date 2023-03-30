import { createOptimizedPicture } from '../../scripts/lib-franklin.js'

export default async function decorate(block) {
    const { href } = block.firstElementChild.querySelector('a')
    const resp = await fetch(href) 
    if (resp.ok) {
        const { data } = await resp.json()
        const teasers = data.map(({ path, image, lastModified, title, author, theme}) => {
            const picture = createOptimizedPicture(image, '', false, [{ width: 400 }])
            return `
                <a href="${path}" title="${title}" class="recent-article">
                    ${picture.outerHTML}
                    <h3>${theme}</h3>
                    <h1>${title}</h1>
                    <h5>BY ${author}</h5>
                    <h6>MARCH 28, 2023, 11:34 AM EDT</h6>
                    <!-- <p>${lastModified}</p> -->
                </a>`
        });
       block.innerHTML = `<ul>${teasers.map(teaser => `<br><li>${teaser}</li>`).join('\n')}</ul>`
     //   block.innerHTML = `<div>${teasers.map(teaser => `<div>${teaser}<//div>`).join('\n')}</div>`
    } else {
        block.remove()
    }
}
