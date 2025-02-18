package com.yupi.web.controller;

import cn.hutool.json.JSONUtil;
import com.yupi.web.common.BaseResponse;
import com.yupi.web.common.ErrorCode;
import com.yupi.web.common.ResultUtils;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kong.unirest.json.JSONObject;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class aiChatController {

    @PostMapping("/chat")
    public BaseResponse<String> sendMessage(@RequestBody String message) {
        try {
            String requestBody = buildRequestBody(message);
            System.out.println("Request Body: " + requestBody); // 打印请求体

            HttpResponse<String> response = Unirest.post("https://api.siliconflow.cn/v1/chat/completions")
                    .header("Authorization", "Bearer " + "sk-rswtmrvkhpgamldyqyoehvqscrzotsjatzbvgxqfxtjgzcav")
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .asString();

            if (response.getStatus() >= 400) {
                System.err.println("API Error Response: " + response.getBody());
                return ResultUtils.error(ErrorCode.OPERATION_ERROR, "API Error: " + response.getStatus() + " - " + response.getStatusText());
            }
            //处理返回的字符串
            String result = response.getBody();
            String content = new JSONObject(result)
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

            JSONObject js = new JSONObject(result)
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message");

            String thinking="";
            if(js.has("reasoning_content")){
                 thinking = js.getString("reasoning_content");
            }

            String answer = "回答: \n \n\n"+content;
            if(StringUtils.hasText(thinking)){
                answer= "思考：\n \n\n"+thinking+"\n \n\n"+"回答: \n \n\n"+content;
            }
            System.out.println(answer);
            return ResultUtils.success(answer);
        } catch (UnirestException e) {
            return ResultUtils.error(ErrorCode.API_ERROR, "Request failed: " + e.getMessage());
        }
    }

    private String buildRequestBody(String userMessage) {
        String prompt = "请记住你是一个帮别人解决代码问题的工具，名字叫CodePulse，" +
                "你是CodePulse代码生成平台的助手，平台介绍如下：可以，下载、在线使用和制作代码生成器，" +
                "帮助文档地址：https://fcninvhzzhwz.feishu.cn/wiki/FzvcwtbCkiJZM7ktN1kcHpysnlb"+
                "别人可以问你任何问题，你要尽力的帮助别人解决问题，" +
                "当别人问你是谁或者网站功能之类的问题的时候，根据上面的内容回答，" +
                "当向你提出问题时，你不需要做自我介绍，直接进行解答，下面是我要对你进行的提问：";
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "Qwen/Qwen2.5-7B-Instruct");

            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content",prompt+ userMessage);
            messages.add(message);

            requestBody.put("messages", messages);
            requestBody.put("stream", false);
            requestBody.put("max_tokens", 3000);
            requestBody.put("temperature", 0.9);
            requestBody.put("top_p", 0.7);

            return mapper.writeValueAsString(requestBody);
        } catch (Exception e) {
            throw new RuntimeException("Failed to build request body", e);
        }
    }
}