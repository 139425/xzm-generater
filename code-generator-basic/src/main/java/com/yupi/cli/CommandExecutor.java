package com.yupi.cli;

import com.yupi.cli.command.ConfigCommand;
import com.yupi.cli.command.GeneratorCommand;
import com.yupi.cli.command.ListCommand;
import picocli.CommandLine;

@CommandLine.Command(name = "xzm", mixinStandardHelpOptions = true)
public class CommandExecutor implements Runnable{

    private final CommandLine commandLine ;

    {
        commandLine = new CommandLine(this)
                .addSubcommand(new GeneratorCommand())
                .addSubcommand(new ListCommand())
                .addSubcommand(new ConfigCommand());
    }

    @Override
    public void run() {
       //不输入子命令时，输出提示
        System.out.println("请输入具体命令，或者输入--help查看命令提示");
    }

    /**
     *
     * 执行命令
     * @param args
     * @return
     */

    public Integer doexecute(String[] args) {
        return commandLine.execute(args);
    }
}
