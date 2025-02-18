package com.yupi.web.model.dto.ai;


import lombok.Data;

import java.io.Serializable;

@Data
public class AiChatRequest implements Serializable {
    String message;
}
