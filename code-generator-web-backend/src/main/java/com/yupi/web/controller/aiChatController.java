package com.yupi.web.controller;

import com.yupi.web.common.BaseResponse;
import com.yupi.web.common.ErrorCode;
import com.yupi.web.common.ResultUtils;
import com.yupi.web.constant.AiChatConstant;
import com.yupi.web.model.dto.aiChat.AiChatRequest;
import com.yupi.web.service.UserService;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kong.unirest.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class aiChatController {

    @Autowired
    HttpServletRequest httpServletRequest;

    @Autowired
    UserService userService;



    @PostMapping("/chat")
    public BaseResponse<String> sendMessage(@RequestBody AiChatRequest aiChatRequest) {
        try {
            //判断是否登录
            if(userService.getLoginUserPermitNull(httpServletRequest)==null){
                //如果未登录，直接返回提示信息
                return ResultUtils.success("未登录，请先注册登录");
            }else{
                Unirest.config()
                        .reset()
                        .connectTimeout(3000000)  // 连接超时设置为300秒
                        .socketTimeout(3000000);// 读取超时设置为300秒

                //SseEmitter emitter = new SseEmitter(300_000L);
                String requestBody = buildRequestBody(aiChatRequest);
                System.out.println("Request Body: " + requestBody); // 打印请求体

                //轨迹流动发起api请求
                HttpResponse<String> response = Unirest.post("https://api.siliconflow.cn/v1/chat/completions")
                        .header("Authorization", "Bearer " + AiChatConstant.KEY)
                        .header("Content-Type", "application/json")
                        .body(requestBody)
                        .asString();


                if (response.getStatus() >= 400) {
                    System.err.println("API Error Response: " + response.getBody());
                    return ResultUtils.error(ErrorCode.OPERATION_ERROR, "API Error: " + response.getStatus() + " - " + response.getStatusText());
                }
                //处理返回的字符串，对于推理模型和非推理模型分开讨论com
                String result = response.getBody();

                String content = new JSONObject(result)
                        .getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getString("content");
                //System.out.println(content);

                JSONObject js = new JSONObject(result)
                        .getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message");

                String thinking="";
                if(js.has("reasoning_content")){
                    thinking = js.getString("reasoning_content");
                }

                String answer = "\n"+content;
                if(StringUtils.hasText(thinking)){
                    answer= "思考：\n"+thinking+"\n\n"+"回答：\n"+content;
                }
                //System.out.println(answer);
                return ResultUtils.success(answer);
            }


        } catch (UnirestException e) {
            return ResultUtils.error(ErrorCode.API_ERROR, "Request failed: " + e.getMessage());
        }
    }

    private String buildRequestBody(AiChatRequest ai) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", ai.getModel());

            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> message = new HashMap<>();
            message.put("role", Role(ai.getRole()));
            message.put("content",/*prompt+*/ ai.getMessage());
            messages.add(message);

            requestBody.put("messages", messages);
            requestBody.put("stream", false);
            requestBody.put("max_tokens", ai.getMaxToken());
            requestBody.put("temperature", ai.getTemperature());
            requestBody.put("top_p", ai.getTopP());
            requestBody.put("top_k", ai.getTopK());
            requestBody.put("frequency_penalty", ai.getFrequencyPenalty());

            return mapper.writeValueAsString(requestBody);
        } catch (Exception e) {
            throw new RuntimeException("Failed to build request body", e);
        }
    }
    private String Role(Integer  i){
        if(i.equals(2))return "assistant";
        if(i.equals(3)) return "system";
        else return "user";
    }
}
