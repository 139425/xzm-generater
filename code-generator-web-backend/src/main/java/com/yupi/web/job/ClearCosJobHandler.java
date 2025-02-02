package com.yupi.web.job;


import cn.hutool.core.util.StrUtil;
import com.xxl.job.core.handler.annotation.XxlJob;
import com.yupi.web.manager.CosManager;
import com.yupi.web.mapper.GeneratorMapper;
import com.yupi.web.model.entity.Generator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
public class ClearCosJobHandler {
    @Resource
    private CosManager cosManager;


    @Resource
    private GeneratorMapper generatorMapper;


    @XxlJob("clearCosJobHandler")
    public void clearCosJobHandler() {
        log.info("clearCosJobHandler start");
        //业务逻辑

        //1.用户上传的模板制作文件（generator_make_template）
        cosManager.deleteDir("/generator_make_template/");

        //2.已删除代码生成器对应的产物包（generator_dist）
        List<Generator> generatorList = generatorMapper.listDeletedGenerator();
        List<String> keyList = generatorList.stream()
                .map(Generator::getDistPath)
                .filter(StrUtil::isNotBlank)
                //删除多个文件必须移除 '/' 前缀,官方文档要求的。。。
                .map(distPath->distPath.substring(1))
                .collect(Collectors.toList());
        cosManager.deleteObjects(keyList);


        log.info("clearCosJobHandler end");


    }

}
