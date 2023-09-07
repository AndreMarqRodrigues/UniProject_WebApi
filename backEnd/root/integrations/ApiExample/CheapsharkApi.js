const axios = require('axios');

exports.getApiData = async function getApiData(ApiID = undefined){
    let url, res

    //preprocessing: ensure a default id is set
    if(ApiID === undefined){
        const randomNumber = Math.floor(Math.random() * 550) + 1;
        console.log(randomNumber)
        url='https://www.cheapshark.com/api/1.0/games?id=' + randomNumber;
     } else{
        //use given ID if it was suplied
        url= 'https://www.cheapshark.com/api/1.0/games?id=' + ApiID; 
    }
    const config = {
        method: 'get',
        url : url
    }
    res = await axios(config)
    console.log(res.status)
    console.log(url)
    


    if(res.status == 200 && res.headers){
        return res.data
    }else{
        return undefined
    }


}

