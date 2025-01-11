package com.yupi.cli.example;

import picocli.CommandLine;
import picocli.CommandLine.Option;

import java.util.concurrent.Callable;

public class Login implements Callable<Integer> {
    @Option(names = {"-u", "--user"}, description = "User name")
    String user;

    @Option(names = {"-p", "--password"}, description = "Passphrase",arity = "0..1", interactive = true)
    String password;

    @Option(names = {"-cp", "--checkPassword"}, description = "Check Password",arity = "0..1", interactive = true)
    String checkPassword;

    public Integer call() throws Exception {
        System.out.println("password = " + password);
        System.out.println("checkPassword = " + checkPassword);
        if(password.equals(checkPassword)) System.out.println("成功");
        else System.out.println("失败");
        return 0;
    }

    public static void main(String[] args) {
        new CommandLine(new Login()).execute("-u", "user123", "-p","-cp");
    }
}

