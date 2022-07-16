import axios from "axios"
import { bytesToSize } from '../lib/helper.js'


function secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? h + 'H ' : "";
    const mDisplay = m > 0 ? m + 'M ' : "";
    const sDisplay = s > 0 ? s + 'S' : "";
    return hDisplay + mDisplay + sDisplay;
}

async function modeminfo(ctx) {
    const imgInfo = await axios.get('http://192.168.7.1/goform/getImgInfo?rand=112');
    const wanInfo = await axios.get('http://192.168.7.1/goform/getWanInfo?rand=11223');
    const usageHistory = await axios.get('http://192.168.7.1/goform/getUseHistory?rand=11223');
    const {
        rssi,
        signal,
        CellID,
        RSRP,
        RSRQ,
        SINR,
        RSCP,
        Band,
        network_name
    } = imgInfo.data

    const {
        wan_ip,
        wan_state,
        Speed_Dl,
        Speed_Ul,
        dur_time,
        last_usage
    } = wanInfo.data

    const {
        monthly_home_usage
    } = usageHistory.data

    const speedDl = bytesToSize(Speed_Dl)
    const speedUl = bytesToSize(Speed_Ul)
    ctx.reply(
        `<b>✨ Modem Information </b>\n\n<code>Status: ${wan_state == 1 ? 'Not Connected' : 'Connected'}\nUptime: ${secondsToHms(dur_time)}\nWAN IP: ${wan_ip} \nNetwork Name: ${network_name}\nSignal: ${signal}\nCellID: ${CellID}\nBand  : ${Band}\nRSSI  : ${rssi} dBm\nRSRP  : ${RSRP} dB\nRSRQ  : ${RSRQ} dB\nSINR  : ${SINR} dB\nRSCP  : ${RSCP}\n\n<b>DL:</b> <code>${speedDl}/s</code>  <b>UL:</b> <code>${speedUl}/s</code>\nLast Usage: ${bytesToSize(last_usage)}\nMonthly Usage: ${bytesToSize(monthly_home_usage)}</code>`,
        { parse_mode: 'HTML' }
    )
}

export default modeminfo