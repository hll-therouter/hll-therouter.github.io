各个主要版本的更新日志：  版本更新日志可查看 Github 的 Release 页面：https://github.com/HuolalaTech/hll-wp-therouter-android/releases

```
v1.3.0-rc7 Pre-release

fix:修复编译时 plugin 偶现空指针问题
```


```
v1.3.0-rc6 Pre-release

feature: AGP8新增编译选项removeClass，详情见文档 https://therouter.cn/docs/2024/07/22/01
feature: 编译插件 cn.therouter.agp8 标记废弃，统一替换为cn.therouter
feature: 支持 gradle configuration cache
```


```
v1.3.0-rc5 Pre-release

feature: Fragment创建失败时添加异常信息到日志 @lukelmouse-github #252
feature: navigation()导航到Activity时，如果 path 不是一个Activity 则只在 debug 环境报错，release 环境不跳转。
refactor: 调整Kotlin语法，兼容K2编译器
```

```
v1.3.0-rc4 Pre-release

fix: 修复二次编译时修改类名，Multiple Activity to single Url必须手动 kill java 进程的问题 #244
fix: 修复多 app module 工程，编译时路由表被合并的问题 #238
```


```
v1.3.0-rc3 Pre-release

fix:修复同时注解@Route、@ServiceProvider在一个类上并配置return type参数时编译报错 @clzd0792 #241
```

```
v1.3.0-rc2 Pre-release

fix: 修复1.3.0-rc1引入的agp8编译失败问题 #239
```


```
v1.3.0-rc1 Pre-release

feature: AGP8新增编译选项forceIncremental和incrementalCachePath，详情见文档https://therouter.cn/docs/2024/07/22/01
feature: 使用JDK17编译
```

```
发布1.2.4版本

整合1.2.4各个rc版本改动，总改动如下：

feature: debug环境加入耗时过久的异步任务检查
feature: 优化AGP8的debug环境编译逻辑
fix: 修复动画设置错误问题
fix: 修复线程池共用时偶现ANR问题
fix: 修复debug环境下，修改类名后原类名缓存依然存在的问题 #220
fix: 修复 plugin 中 debug 开关对agp8失效问题
fix: 修复debug环境下线程安全问题
fix: 修复@Autowired中的required为true时并未生效问题 #196
fix: 修复KSP编译路字符过长时编译失败问题 #162
fix: 修复KAPT编译期路由表过长造成的编译失败问题
fix: 修复UI线程加锁可能造成的ANR问题
fix: 修复agp4编译时内部类读取失败可能造成的编译失败
fix: 修复debug环境下TheRouter.inject()对继承类注入错误问题
```



```
发布1.2.3版本

feature: 确保TheRouter.get()方法线程安全  #188 #212
refactor: 重构编译插件，大幅优化编译速度。具体改动见文档：https://therouter.cn/docs/2024/07/22/01
refactor: 优化ksp编译性能 @hust-twj #184
refactor: 重写AGP8编译，大幅提升编译速度，支持增量编译，具体改动见文档：https://kymjs.com/code/2024/10/31/01/
refactor: 编译插件移除apache.common-io依赖
refactor: Gradle7编译默认使用AGP8方案
refactor: AGP8插件，降低Gradle版本号到8.0.2
fix: 修复 debug 模式下，线程池偶现空指针问题。
fix: 修复windows系统下偶现jar不可删除问题。
fix: 修复与第三方插件兼容性问题 #193
fix: 修复Navigator非空强转错误 #208
fix: 修复Debug环境线程池安全问题
```



```
发布1.2.2版本

整合1.2.2各个rc版本改动，总改动如下：

feature: 加入url嵌套url的解析（严格来讲参数没有encode，这已经不是一个合法url了，但这种情况在APP上非常常见，所以单独提供支持）
feature: 加入url参数无value时的解析 #8cf9c9b
refactor: 精简路由日志
refactor: 修改NavigationCallback.onLost()参数，支持获取失败时传入的requestCode change-code
refactor: 修改Navigation解析url规则，支持hash参数解析。详情请见API文档
fix: 修复路由参数为空时，会有冗余参数被传递的问题
fix:修复新版本Gradle，AGP8插件allClass获取不到问题
fix: 修复@Autowire 注解的ServiceProvider注入异常的问题 #133
fix: 修复KSP解析@Route注解时，有其他注解干扰会产生空数据的问题 #146
fix: 修复KSP解析@Autowired注解时，field与包名相同会丢失包名问题 #138
fix: 修复KSP无法成功解析top level函数问题
```



```
发布1.2.1版本

整合1.2.0各个rc版本改动，总改动如下：

feature: 发布全新AGP8插件，构建速度更快，相关使用请查阅《从零接入 TheRouter》
feature: 兼容 ASM 6.x-9.x 版本
feature: 整理编译过程日志输出，减少无用日志
feature: 优化KSP生成路由表初始化性能 #116
feature: 初始化方法新增可选是否异步初始化ServiceProvider
feature: 新增编译期参数CHECK_ROUTE_MAP=delete，每次构建可选删除本地routeMap.json
feature: 新增编译期参数读取方式，支持读取gradle.properties和local.properties。若有冲突配置，则以local为准。
refactor: 统一FlowTask运行时与编译时日志
refactor: 修改变量名Navigator.normalUrl为Navigator.originalUrl
fix: 修复KSP编译不兼容ViewBinding问题
fix: 修复在API 17上的兼容性问题
fix: 修复ActionManager多线程安全问题
fix: 修复AGP8添加CHECK_ROUTE_MAP后无法编译问题
fix: 修复Navigator中，NavigatorPathFixHandle执行后没有更新simpleUrl的问题
fix: 修复Java代码编译期概率出现读不到ServiceProvider.returnType的情况
```


```
发布1.1.4版本

整合1.1.4各个rc版本改动，总改动如下：

feature: 非增量构建时清空编译环境 #74
feature: 移除废弃代码ActionInterceptor.handle(context,bundle)
feature: 移除废弃代码TheRouterFlowTask.APP_ONCREATE
feature: 合并KSP功能
feature: 兼容jbr与openjdk注解处理器差异 #52 、 #69
feature: 优化编译期@ServiceProvider解析速度 #84
feature: 最低兼容版本降低为API 17 (4.2)
feature: 新增支持挂起的Fragment和Intent创建
feature: 新增通过类名获取路由表的方法matchRouteMapForClassName()
fix: 修复路由拦截器watch方法无法重写问题
fix: 修复@Autowired解析失败造成后续解析中断问题
fix: 修复ASM7不再支持Java11问题 #93
fix: 修复日志记录过多时可能造成的OOM问题 #98
```

```
发布1.1.3版本

整合1.1.3各个rc版本改动，总改动如下：

feature: @ActionInterceptor 支持注释声明
feature: 路由跳转拦截器新增watch()方法，支持指定path生效，默认所有页面均生效
feature: 支持dynamicFeature构建 #67
feature: 升级依赖gson至2.9.1 #64
feature: 编译期日志加入JDK版本号
feature: 修改编译插件过滤条件，加快编译速度
refactor: 修改 Log 的 Tag #50
fix: 修复 @Autowired 继承类无法注入的问题 #49
fix: 修复在 Windows 系统上，apt生成类中文乱码问题
fix: 修复内部类类型、序列化类型，不支持@Autowired注入的问题
fix: 修复线程池偶现 Crash 问题
fix: 修复debug模式下增删底层依赖需要clean的问题 #70
fix: 修复@ServiceProvider显示声明参数在两个以上时构建失败的问题
```


```
发布1.1.2版本

整合1.1.2各个rc版本改动，总改动如下：

feature: 提升 ActionManager 使用灵活性，暴露 Navigator对象供外部定制拦截规则。
feature: 提升 ActionManager 使用灵活性，为链式调用新增参数传递能力。
feature: plugin中新增FlowTask编译期依赖图展示，使用请参考文档：https://therouter.cn/docs/2022/08/26/01
feature：VirtualFlowTask 新增依赖关系，保证事件先后顺序。
feature：@ServiceProvider 支持类注释（类如果实现多个接口，需要手动声明returnType）
refactor: 重构 DefaultUrlParser 解析方式，兼容KSP生成代码。
refactor：废弃TheRouterFlowTask.APP_ONCREATE，替换为TheRouterFlowTask.THEROUTER_INITIALIZATION，预计会在1.1.4版本移除废弃代码。
refactor: 修改TheRouterTrojan类名为TheRouteContentProvider。
fix:TheRouterLifecycleCallback 内存泄露问题。
```



```
发布1.1.1版本

整合1.1.1各个rc版本改动，总改动如下：

feature: Navigator内部不再自动对参数decode
feature: Navigator.getUrlWithParams()允许自定义参数解析
refactor: 重构DefaultUrlParser解析方式
fix: 修复自定义源码路径的工程使用plugin生成代码异常的问题
feature: 内置FlowTask事件BEFORE_THEROUTER_INITIALIZATION用于TheRouter初始化前执行事件
feature: 共享元素动画支持
feature: 为Navigator新增填充Bundle参数的方法
fix: plugin中生成代码的catch改为Throwable
feature: 提升plugin生成代码的执行效率
bugfix：plugin在Windows下路由表校验错误的问题
```