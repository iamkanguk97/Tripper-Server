'use strict';
const axios = require('axios');
const { KAKAO } = require('../../config/vars');

const searchArea = async (area, pageNumber, latitude, longitude) => {
    const SORT_METHOD = KAKAO.SEARCH.SORT_METHOD;
    const DATA_COUNT = KAKAO.SEARCH.DATA_COUNT_PER_PAGE;
    const KAKAO_REST_KEY = KAKAO.REST_API_KEY;

    // const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${area}&size=${DATA_COUNT}&sort=${SORT_METHOD}`;
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${area}&x=${latitude}&y=${longitude}&size=${DATA_COUNT}&sort=${SORT_METHOD}`;
    const result = await axios({
        method: 'GET',
        url: encodeURI(url),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `KakaoAK ${KAKAO_REST_KEY}`
        }
    });

    console.log(result.data);
    console.log(result.data.documents);
    return result.data.documents;
};

module.exports = {
    searchArea
};