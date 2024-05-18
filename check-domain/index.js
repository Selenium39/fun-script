const axios = require('axios');

// 所有的域名后缀
const defaultDomainSuffixes = [
    "com", "cn", "top", "xyz", "net", "work", "vip", "email", "club", "site", "live", "wang", "中国",
    "企业", "online", "tech", "cc", "fans", "group", "host", "cloud", "shop", "team", "beer", "ren",
    "technology", "fashion", "luxe", "yoga", "red", "love", "ltd", "chat", "pub", "run", "city", "kim",
    "pet", "space", "fun", "store", "pink", "ski", "design", "ink", "wiki", "video", "company", "plus",
    "center", "cool", "fund", "gold", "guru", "life", "show", "today", "world", "zone", "social", "bio",
    "black", "blue", "green", "lotto", "organic", "poker", "promo", "vote", "archi", "voto", "fit",
    "website", "press", "icu", "art", "law", "band", "media", "cab", "cash", "cafe", "games", "link",
    "fan", "我爱你", "移动", "中文网", "集团", "在线", "游戏", "网店", "网址", "网站", "商店", "娱乐", "info",
    "pro", "mobi", "asia", "studio", "biz", "vin", "news", "fyi", "tax", "tv", "market", "shopping",
    "mba", "sale", "co", "com.cn", "net.cn", "org.cn", "ac.cn", "zj.cn", "yn.cn", "xz.cn", "xj.cn",
    "tw.cn", "tj.cn", "sx.cn", "sn.cn", "sh.cn", "sd.cn", "sc.cn", "qh.cn", "nx.cn", "nm.cn", "mo.cn",
    "ln.cn", "jx.cn", "js.cn", "jl.cn", "hn.cn", "hk.cn", "hl.cn", "hi.cn", "he.cn", "hb.cn", "ha.cn",
    "gx.cn", "gz.cn", "gs.cn", "fj.cn", "cq.cn", "bj.cn", "gd.cn", "ah.cn"
];

// 生成所有可能的域名组合
function generateDomainList(domain, suffixes) {
    return suffixes.map(suffix => `${domain}.${suffix}`);
}

// 将域名列表分割成每组10个的子数组
function chunkArray(array, chunkSize) {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        results.push(array.slice(i, i + chunkSize));
    }
    return results;
}

// 查询域名注册状态的函数
async function checkDomainRegistration(domainList) {
    const url = 'https://qcwss.cloud.tencent.com/capi/ajax-v3?action=BatchCheckDomain&from=domain_buy&csrfCode=&uin=0&_=1716002446980&mc_gtk=&t=1716002446980&g_tk=&_format=json';

    const data = {
        "DomainList": domainList,
        "Filter": 0,
        "Period": 1,
        "HashId": "1716001932640",
        "SaveDomainSearch": false
    };

    const headers = {
        'Content-Type': 'application/json',
        'Cookie': 'isQcloudUser=false'
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error checking domain registration:', error);
        throw error;
    }
}

async function checkDomainAvailability(domain, suffixes = defaultDomainSuffixes, price = Number.MAX_SAFE_INTEGER) {
    const domainList = generateDomainList(domain, suffixes);
    const chunkedDomainList = chunkArray(domainList, 10);

    const promises = chunkedDomainList.map(async (chunk) => {
        const response = await checkDomainRegistration(chunk);

        if (response.status.code !== 0) {
            console.error('Error in response:', response.status.msg);
            return [];
        }

        return response.result.data.DomainList
            .filter(domainInfo => domainInfo.Available && domainInfo.RealPrice < price)
            .map(domainInfo => domainInfo.DomainName);
    });

    const results = await Promise.all(promises);

    const availableDomains = results.flat();

    return availableDomains;
}




; (async () => {
    const customSuffixes = [
        "com", "top", "xyz", "net", "work", "vip", "email", "club", "site", "live", "online", "tech", "cc",
        "fans", "group", "host", "cloud", "shop", "team", "beer", "ren", "technology", "fashion", "luxe",
        "yoga", "red", "love", "ltd", "chat", "pub", "run", "city", "kim", "pet", "space", "fun", "store",
        "pink", "ski", "design", "ink", "wiki", "video", "company", "plus", "center", "cool", "fund", "gold",
        "guru", "life", "show", "today", "world", "zone", "social", "bio", "black", "blue", "green", "lotto",
        "organic", "poker", "promo", "vote", "archi", "voto", "fit", "website", "press", "icu", "art", "law",
        "band", "media", "cab", "cash", "cafe", "games", "link", "fan", "info", "pro", "mobi", "asia", "studio",
        "biz", "vin", "news", "fyi", "tax", "tv", "market", "shopping", "mba", "sale", "co"
    ];

    const domain = "wzc";

    const price = 50

    const availableDomains = await checkDomainAvailability(domain, customSuffixes, price)
    console.log('Available domains:', availableDomains);


})();
