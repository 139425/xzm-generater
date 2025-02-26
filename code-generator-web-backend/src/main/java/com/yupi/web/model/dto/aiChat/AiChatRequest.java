package com.yupi.web.model.dto.aiChat;


import lombok.Data;

import java.io.Serializable;

@Data
public class AiChatRequest implements Serializable {
    //模型
    private String model = "Qwen/Qwen2.5-7B-Instruct";

    //用户的角色
    private Integer role = 1;

    //问题
    private String message="1+1等于几";

    //最大单次token数量 1到8192
    private Integer maxToken = 512;

    //回答的随机程度 0到2
    private double temperature = 0.7;

    //top_p：基于概率累积动态选择候选词，与灵活性成正比，稳定性成反比 0到1
    private double topP = 0.7;

    //top_k：固定选择前k个词，与灵活性成正比，稳定性成反比 大于1
    private double topK=50;

    //减少重复词语出现频率，与灵活性成正比，稳定性成反比 -2到2
    private double frequencyPenalty = 0.7;


}
