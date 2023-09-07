const axios = require('axios');

exports.getApiData = async function getApiData(ApiID = undefined){
    let url, res

    //preprocessing: ensure a default id is set
    if(ApiID === undefined){
        url='https://opentdb.com/api.php?amount=1&category=15'
     } else{
        //use given ID if it was suplied
        url= 'https://opentdb.com/api.php?amount='+ ApiID + '&category=15'; 
    }
    const config = {
        method: 'get',
        url : url
    }
    res = await axios(config);
    console.log(res.status)
    console.log(url)


    if(res.status == 200){
        return res.data
    }else{
        return undefined
    }


}

