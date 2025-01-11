package com.yupi.cli.command;

import cn.hutool.core.bean.BeanUtil;
import com.yupi.generator.MainGenerator;
import com.yupi.model.MainTempleteConfig;
import lombok.Data;
import picocli.CommandLine;

import java.util.concurrent.Callable;

@CommandLine.Command(name = "generator",description = "生成代码", mixinStandardHelpOptions = true)
@Data
public class GeneratorCommand implements Callable<Integer> {

    @CommandLine.Option(names = {"-a", "--author"}, description = "作者姓名",arity = "0..1", interactive = true,echo = true)
    private String author = "xzm";

    @CommandLine.Option(names = {"-o", "--outputText"}, description = "输出文本",arity = "0..1", interactive = true,echo = true)
    private String outputText = "sum = ";

    @CommandLine.Option(names = {"-l", "--loop"}, description = "是否循环",arity = "0..1", interactive = true,echo = true)
    private boolean loop = false;


    public Integer call() throws Exception {
        MainTempleteConfig mainTempleteConfig = new MainTempleteConfig();
        BeanUtil.copyProperties(this,mainTempleteConfig);
        System.out.println("配置信息：" + mainTempleteConfig);
        MainGenerator.doGenerator(mainTempleteConfig);
        return 0;
    }
}
