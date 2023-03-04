'use strict';
const axios = require('axios');
const { KAKAO } = require('../../config/vars');
const { errResponse } = require('../../config/response/response-template');
const responseMessage = require('../../config/response/baseResponseStatus');

const searchArea = async (area, pageNumber, latitude, longitude) => {
    const SORT_METHOD = KAKAO.SEARCH.SORT_METHOD;
    const DATA_COUNT = KAKAO.SEARCH.DATA_COUNT_PER_PAGE;
    const KAKAO_REST_KEY = KAKAO.REST_API_KEY;

    // DOCS: x가 경도, y가 위도!
    const url = `https://dapiasfd.kakao.com/v2/local/search/keyword.json?sort=${SORT_METHOD}&page=${pageNumber}&size=${DATA_COUNT}&x=${longitude}&y=${latitude}&query=` + encodeURIComponent(area);
    const result = await axios({
        method: 'GET',
        url: url,
        headers: {
            'Authorization': `KakaoAK ${KAKAO_REST_KEY}`
        }
    });

    if ((result.data.documents).length === 0)   // 검색 결과가 없다면
        return errResponse(responseMessage.KAKAO_SEARCH_EMPTY_RESULT);

    const is_end = result.data.meta.is_end;
    const result_arr = result.data.documents;

    const new_result_arr = result_arr.map((v) => {
        // if (v.category_group_code === '') v.category_group_code = null;
        // if (v.category_group_name === '') v.category_group_name = null;
        
        return {
            address_name: v.address_name,
            category_code: v.category_group_code,
            category_name: v.category_group_name,
            place_name: v.place_name,
            x: v.x,
            y: v.y
        };
    });

    return {
        pageNumber,
        is_end,
        list: new_result_arr
    };
};

module.exports = {
    searchArea
};