'use strict';
const CommonService = require('../services/common.service');

const searchArea = async (req, res) => {
    const area = req.query.area;
    const page_number = parseInt(req.query.page);
    const latitude = req.query.lat;   // 클라이언트의 현재 위도
    const longitude = req.query.lon;   // 클라이언트의 현재 경도

    const searchAreaResult = await CommonService.searchArea(area, page_number, latitude, longitude);
    return res.send(searchAreaResult);
};

module.exports = {
    searchArea
};



// let result;
//     // let url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${area}&x=${x}&y=${y}&page=${page}&size=${size}&sort=${sort_method}`
//     let url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${area}&page=${page}&size=${size}&sort=${sort_method}`
//     try {
//         result = await axios({
//             method: 'GET',
//             url: encodeURI(url),
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `KakaoAK ${rest_key}`,
//             }
//         });
//     } catch(err) {
//         return res.send(errResponse(baseResponse.AREA_SEARCH_FAILED));
//     }

//     if ((result.data.documents).length === 0)   // 조회 결과가 없으면?
//         return res.send(errResponse(baseResponse.AREA_SEARCH_RESULT_EMPTY));

//     let is_end = result.data.meta.is_end;
//     let result_arr = result.data.documents;
//     let new_result_arr = [];

//     for(let i in result_arr) {
//         if (result_arr[i].category_group_code === '') result_arr[i].category_group_code = null;
//         if (result_arr[i].category_group_name === '') result_arr[i].category_group_name = null;

//         let temp = {
//             address_name: result_arr[i].address_name,
//             category_code: result_arr[i].category_group_code,
//             category_name: result_arr[i].category_group_name,
//             place_name: result_arr[i].place_name,
//             x: result_arr[i].x,
//             y: result_arr[i].y
//         };

//         new_result_arr.push(temp);
//     }

//     return res.send(response(baseResponse.AREA_INQUIRE_KEYWORD_SUCCESS, { 'pageNum': page, 'is_end': is_end, 'list': new_result_arr }));