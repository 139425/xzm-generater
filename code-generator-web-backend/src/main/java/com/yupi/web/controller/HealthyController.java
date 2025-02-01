package com.yupi.web.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 健康检查
 */

//qps最高6500左右

@RestController
@RequestMapping("/healthy")
@Slf4j
public class HealthyController {

    @GetMapping("/xzm")
    public String healthCheck() {
        return "ok";
    }

}
