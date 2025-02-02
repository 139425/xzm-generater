package com.yupi.web;

import com.yupi.web.manager.CosManager;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.util.Arrays;

@SpringBootTest
class CosManagerTest {

    @Resource
    private CosManager cosManager;

    @Test
    void deleteObject() {
        cosManager.deleteObject("/test/屏幕截图 2023-07-13 132028.png");
    }

    @Test
    void deleteObjects() {
        cosManager.deleteObjects(Arrays.asList("generator_make_template/1/a.zip",
                "generator_make_template/1/b.zip"
        ));
    }

    @Test
    void deleteDir() {
        cosManager.deleteDir("/generator_picture/1/");
    }
}