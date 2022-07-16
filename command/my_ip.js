import axios from "axios"

async function my_ip(ctx) {
    try {
        const { data } = await axios.get('http://ip-api.com/json')
        ctx.reply(
            `<code>IP: ${data.query}\nCountry: ${data.country} ${data.countryCode}\nRegion: ${data.regionName}\nCity: ${data.city}\nISP: ${data.isp}</code>`,
            { parse_mode: 'HTML' }
        )
    } catch (error) {
        ctx.reply(
            'Failed',
            { parse_mode: 'HTML' }
        )
        console.log(error)
    }
}

export default my_ip