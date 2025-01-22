package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.web.mapper.GeneratorMapper;
import com.yupi.web.model.entity.Generator;
import generator.service.GeneratorService;
import org.springframework.stereotype.Service;

/**
* @author 34631
* @description 针对表【generator(代码生成器)】的数据库操作Service实现
* @createDate 2025-01-21 10:56:05
*/
@Service
public class GeneratorServiceImpl extends ServiceImpl<GeneratorMapper, Generator>
    implements GeneratorService{

}




