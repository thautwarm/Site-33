---
oldUrl: /life/windows-workflow.html
date: 2022-09-07
---

# Windows上的Linux工作流搭建

今天在新电脑上配置工作环境，由于是每次都很耗时的重复工作，这次就来记录一下全流程。

## 这个页面的大概用处

首先是方便我自己以后配置环境。

此外，作为一份独家指南，本页面详细指导如何在Windows上搭建原生的linux工作环境。


## MSYS2 & Why NOT WSL?

这个方案将基于MSYS2。不使用WSL的根本原因是，对于基础开发需求，WSL仍然与原生Linux开发有差异。

WSL的问题可以细分为以下几点：

1. Windows上书写的bash文件强行使用CRLF，因此在WSL下运行失败。

2. Windows上不能直接修改WSL中的文件，否则文件失效。

3. WSL的home不是Windows home，这意味着我有两个.bashrc/.zshrc，有两套不同的环境，两套环境还需要区别对待。虽有一定的互操作性，但Windows/WSL的文件/命令等对于另一方需特殊对待。

相比于使用WSL的诸多问题，我们使用MSYS2达成的效果是：一个支持Windows桌面系统的linux开发环境，或者一个正确支持的linux工具集的Windows [^1]。


## 配置流程

### 0. Windows系统驱动，以及代理软件

使用供应商提供的驱动安装方式，如thinkpad使用联想商店安装驱动。

对于代理软件，因为新机器的网络还未配置，此时获取软件是比较麻烦的。可以在旧机器上使用 `python -m http.server <端口号>` 开启文件服务器，然后在装机的机器上访问下载好的代理软件以及配置。

### 1. 最基本的配置


0. 将用户目录加入快速访问

1. 针对使用 win+space 切换输入法以避免按键冲突的用户解决 Windows 输入法问题，做以下步骤：

    - 卸载默认的中文输入法 (在首先语言里删除中文)
    - 安装想要的输入法，如搜狗输入法
    - 新建一个注册表文件 `坑爹bug.reg` ([来源的知乎回答](https://www.zhihu.com/question/22288432/answer/447721321))，输入如下内容并执行，重启生效：
        ```powershell
        Windows Registry Editor Version 5.00
        [HKEY_CURRENT_USER\Control Panel\Input Method\Hot Keys\00000010]
        "Key Modifiers"=hex:00,c0,00,00
        "Virtual Key"=hex:ff,00,00,00
        [HKEY_CURRENT_USER\Control Panel\Input Method\Hot Keys\00000070]
        "Key Modifiers"=hex:00,c0,00,00
        "Virtual Key"=hex:ff,00,00,00
        [HKEY_USERS\.DEFAULT\Control Panel\Input Method\Hot Keys\00000010]
        "Key Modifiers"=hex:02,c0,00,00
        "Target IME"=hex:00,00,00,00
        "Virtual Key"=hex:ff,00,00,00
        [HKEY_USERS\.DEFAULT\Control Panel\Input Method\Hot Keys\00000070]
        "Key Modifiers"=hex:02,c0,00,00
        "Target IME"=hex:00,00,00,00
        "Virtual Key"=hex:ff,00,00,00
        ```

2. 针对 Emacs 用户，切换 Ctrl 和 Capslock 键:

    - 新建注册文件 `switch-ctrl-capslock.reg` 输入以下内容并执行，重启生效：

        ```powershell
        Windows Registry Editor Version 5.00
        [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
        "Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00
        ```

3. (对于使用Edge的用户) 使用规则代理：

    - 开启全局代理。

    - 打开 Microsoft Edge，访问 Chrome 商店，为 Edge 安装 SwitchyOmega。

        注意：移植到 Edge 商店中的 SwitchyOmega 有后门，会窃取你的支付信息等，为了避免造成严重的财产损失，请务必使用 Chrome 商店上的官方 SwitchyOmega。

    - 设置完规则代理后，关闭全局代理。

### 2. 开发环境配置


1. 安装更新的powershell:

    [https://docs.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows](https://docs.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows)

    该页面应包含powershell下载链接。

2. 配置Windows包管理器scoop

    - 官方页面 [https://scoop.sh/](https://scoop.sh/) 介绍了最新的scoop安装方法。记得设置Policy时要使用管理员权限。

    - 安装scoop后，执行以下命令：

    ```bash
    [net.webrequest]::defaultwebproxy = new-object net.webproxy "http://127.0.0.1:<端口号>"
    scoop config proxy 127.0.0.1:<端口号>
    scoop install git
    ```

3. 安装vscode:

    ```bash
    scoop bucket add extras
    scoop install vscode
    # 右键打开vscode （执行后重启生效）：
    C:\Users\<用户名>\scoop\apps\vscode\current\install-associations.reg
    ```

    随后打开vscode, 登录GitHub账号，同步键位和主题。

4. 配置msys2和其他插件 （建议暂且先使用我提供的配置，后续做自定义修改）

    1. 在windows高级系统设置里，设置用户系统变量

        ```bash
        HOME=C:\Users\<用户名>
        HOMEPATH=C:\Users\<用户名>
        ```

    2. 安装字体Caskaydia Cove Regular Nerd Font Complete Windows Compatible.otf

        字体目录链接:

        [https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/CascadiaCode/Regular/complete](https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/CascadiaCode/Regular/complete)

    3. 从应用商店安装 windows terminal

       如果windows应用商店无法打开，可以直接在浏览器中访问 [windows-terminal](https://www.microsoft.com/zh-cn/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab)。

    4. 打开 windows terminal，修改键位：将`switch-to-tab index <编号>`设置为`alt + <编号 - 1>`。

    5. 安装 MSYS2 和一些重要插件，但暂且先不要执行 `msys2` 命令。

        ```bash
        scoop install msys2
        scoop install fnm
        ```

    6. windows terminal 点开 settings，新建空 profile，任意取名，commend line 参数填入 `mingw64.cmd -shell bash`。

        将该 profile 设置为默认 profile。找不到图形界面可以打开 JSON Settings，将默认的 profile uuid 改为刚刚新建的 profile 的 uuid。所有信息都可以在 JSON Settings 中找到。

    7. 设置刚刚新建的 Profile 的外观 (Appearance 选项)，将字体设置为刚刚安装的 CaskaydiaCove NF，颜色主题自选。

    8. 新建 `~/.bash_profile`，用 vscode 打开，填入以下内容

        <details>
        <summary>点击展开.bash_profile 文件内容</summary>

        ```bash
        if [ -f "${HOME}/.bashrc" ] ; then
            source "${HOME}/.bashrc"
        fi
        ```

        </details>

    9. 新建 `~/.bash-colors.sh` 和 `~/.bashrc`，填入以下内容 (推荐走完配置流程后再自行配置)。

        <details>
        <summary>点击展开.bash-colors.sh 文件内容</summary>

        ```bash
        # .bash-colors.sh
        function __ {
          echo "$@"
        }
        function __make_ansi {
          next=$1; shift
          echo "\[\e[$(__$next $@)m\]"
        }
        function __make_echo {
          next=$1; shift
          echo "\033[$(__$next $@)m"
        }
        function __reset {
          next=$1; shift
          out="$(__$next $@)"
          echo "0${out:+;${out}}"
        }
        function __bold {
          next=$1; shift
          out="$(__$next $@)"
          echo "${out:+${out};}1"
        }
        function __faint {
          next=$1; shift
          out="$(__$next $@)"
          echo "${out:+${out};}2"
        }
        function __italic {
          next=$1; shift
          out="$(__$next $@)"
          echo "${out:+${out};}3"
        }
        function __underline {
          next=$1; shift
          out="$(__$next $@)"
          echo "${out:+${out};}4"
        }
        function __negative {
          next=$1; shift
          out="$(__$next $@)"
          echo "${out:+${out};}7"
        }
        function __crossed {
          next=$1; shift
          out="$(__$next $@)"
          echo "${out:+${out};}8"
        }
        function __color_normal_fg {
          echo "3$1"
        }
        function __color_normal_bg {
          echo "4$1"
        }
        function __color_bright_fg {
          echo "9$1"
        }
        function __color_bright_bg {
          echo "10$1"
        }
        function __color_black   {
          echo "0"
        }
        function __color_red   {
          echo "1"
        }
        function __color_green   {
          echo "2"
        }
        function __color_yellow  {
          echo "3"
        }
        function __color_blue  {
          echo "4"
        }
        function __color_magenta {
          echo "5"
        }
        function __color_cyan  {
          echo "6"
        }
        function __color_white   {
          echo "7"
        }
        function __color_rgb {
          r=$1 && g=$2 && b=$3
          [[ r == g && g == b ]] && echo $(( $r / 11 + 232 )) && return # gray range above 232
          echo "8;5;$(( ($r * 36  + $b * 6 + $g) / 51 + 16 ))"
        }
        function __color {
          color=$1; shift
          case "$1" in
            fg|bg) side="$1"; shift ;;
            *) side=fg;;
          esac
          case "$1" in
            normal|bright) mode="$1"; shift;;
            *) mode=normal;;
          esac
          [[ $color == "rgb" ]] && rgb="$1 $2 $3"; shift 3
          next=$1; shift
          out="$(__$next $@)"
          echo "$(__color_${mode}_${side} $(__color_${color} $rgb))${out:+;${out}}"
        }
        function __black   {
          echo "$(__color black $@)"
        }
        function __red   {
          echo "$(__color red $@)"
        }
        function __green   {
          echo "$(__color green $@)"
        }
        function __yellow  {
          echo "$(__color yellow $@)"
        }
        function __blue  {
          echo "$(__color blue $@)"
        }
        function __magenta {
          echo "$(__color magenta $@)"
        }
        function __cyan  {
          echo "$(__color cyan $@)"
        }
        function __white   {
          echo "$(__color white $@)"
        }
        function __rgb {
          echo "$(__color rgb $@)"
        }
        function __color_parse {
          next=$1; shift
          echo "$(__$next $@)"
        }
        function color {
          echo "$(__color_parse make_ansi $@)"
        }
        function echo_color {
          echo "$(__color_parse make_echo $@)"
        }
        black="\[\e[0;30m\]"
        red="\[\e[0;31m\]"
        green="\[\e[0;32m\]"
        yellow="\[\e[0;33m\]"
        blue="\[\e[0;34m\]"
        purple="\[\e[0;35m\]"
        cyan="\[\e[0;36m\]"
        white="\[\e[0;37m\]"
        lightyellow="\[\e[0;91m\]"
        lightblue="\[\e[0;94m\]"
        lightcyan="\[\e[0;96m\]"
        bold_black="\[\e[30;1m\]"
        bold_red="\[\e[31;1m\]"
        bold_green="\[\e[32;1m\]"
        bold_yellow="\[\e[33;1m\]"
        bold_blue="\[\e[34;1m\]"
        bold_purple="\[\e[35;1m\]"
        bold_cyan="\[\e[36;1m\]"
        bold_white="\[\e[37;1m\]"
        bold_orange="\[\e[91;1m\]"
        underline_black="\[\e[30;4m\]"
        underline_red="\[\e[31;4m\]"
        underline_green="\[\e[32;4m\]"
        underline_yellow="\[\e[33;4m\]"
        underline_blue="\[\e[34;4m\]"
        underline_purple="\[\e[35;4m\]"
        underline_cyan="\[\e[36;4m\]"
        underline_white="\[\e[37;4m\]"
        underline_orange="\[\e[91;4m\]"
        background_black="\[\e[40m\]"
        background_red="\[\e[41m\]"
        background_green="\[\e[42m\]"
        background_yellow="\[\e[43m\]"
        background_blue="\[\e[44m\]"
        background_purple="\[\e[45m\]"
        background_cyan="\[\e[46m\]"
        background_white="\[\e[47;1m\]"
        background_orange="\[\e[101m\]"
        normal="\[\e[0m\]"
        reset_color="\[\e[39m\]"
        # These colors are meant to be used with `echo -e`
        echo_black="\033[0;30m"
        echo_red="\033[0;31m"
        echo_green="\033[0;32m"
        echo_yellow="\033[0;33m"
        echo_blue="\033[0;34m"
        echo_purple="\033[0;35m"
        echo_cyan="\033[0;36m"
        echo_white="\033[0;37;1m"
        echo_orange="\033[0;91m"
        echo_bold_black="\033[30;1m"
        echo_bold_red="\033[31;1m"
        echo_bold_green="\033[32;1m"
        echo_bold_yellow="\033[33;1m"
        echo_bold_blue="\033[34;1m"
        echo_bold_purple="\033[35;1m"
        echo_bold_cyan="\033[36;1m"
        echo_bold_white="\033[37;1m"
        echo_bold_orange="\033[91;1m"
        echo_underline_black="\033[30;4m"
        echo_underline_red="\033[31;4m"
        echo_underline_green="\033[32;4m"
        echo_underline_yellow="\033[33;4m"
        echo_underline_blue="\033[34;4m"
        echo_underline_purple="\033[35;4m"
        echo_underline_cyan="\033[36;4m"
        echo_underline_white="\033[37;4m"
        echo_underline_orange="\033[91;4m"
        echo_background_black="\033[40m"
        echo_background_red="\033[41m"
        echo_background_green="\033[42m"
        echo_background_yellow="\033[43m"
        echo_background_blue="\033[44m"
        echo_background_purple="\033[45m"
        echo_background_cyan="\033[46m"
        echo_background_white="\033[47;1m"
        echo_background_orange="\033[101m"
        echo_normal="\033[0m"
        echo_reset_color="\033[39m"
        ```

        </details>

        <details>
        <summary> 点击展开.bashrc 文件内容 </summary>

        ```bash
        # ~/.bashrc
        export PUB_HOSTED_URL=https://pub.flutter-io.cn
        export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
        export PYTHONIOENCODING=utf8
        export JULIA_PKG_SERVER="https://mirrors.ustc.edu.cn/julia"
        PROMPT_COMMAND="prompt-command"
        # cache init
        export NODE_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/
        export PATH="$HOME/.local/bin:$HOME/local/Julia-1.7.2/bin:$PATH"
        # conda setup
        function use-conda(){
            if command -v conda &> /dev/null
            then
                source activate base
            fi
        }
        if [[ -z "$my_pragma_once" ]]; then
            source ~/.bash-colors.sh
            source "$(scoop prefix git)\etc\profile.d\git-prompt.sh"
            source /usr/share/bash-completion/bash_completion
            export PATH=$HOME/scoop/shims:$PATH
            export my_pragma_once=1
        fi
        HISTSIZE=100000
        HISTFILESIZE=200000
        HOME=~
        HISTFILE=~/.bashistory
        bind 'set show-all-if-ambiguous on'
        bind 'TAB:menu-complete'
        bind '"\e[A": history-search-backward'
        bind '"\e[B": history-search-forward'
        bind '"\eOA": history-search-backward'
        bind '"\eOB": history-search-forward'
        function setup-bash-git(){
            pacman -S mingw-w64-x86_64-emacs
            git config --global core.autocrlf false
            git config --global core.eol lf
            git config --global core.editor "emacs"
            # 鍙栨秷涓嬭娉ㄩ噴锛屼娇鐢╲scode浣滀负git鐨勯粯璁ょ紪杈戝櫒
            # git config --global core.editor "code --wait"
        }
        STATUS_THEME_PROMPT_BAD="${bold_red}馃挗${reset_color}${normal} "
        STATUS_THEME_PROMPT_OK="${bold_green}鉁?{reset_color}${normal} "
        function mode-simple(){
            SIMPLE_PROMPT=1
        }
        function mode-pretty(){
            SIMPLE_PROMPT=
        }
        function j(){
            cd "$(ajmp complete $@)"
        }
        function chpwd(){
            ajmp update "$PWD"
        }
        function prompt-command(){
            # record history
            history -a
            # apply chpwd
            if [[ "$LASTWD" !=  "$PWD" ]]; then
                chpwd
            fi
            LASTWD=$PWD
            # set prompt status
            if [ $? -eq 0 ]
            then
                my_status=" $STATUS_THEME_PROMPT_OK"
            else
                my_status=" $STATUS_THEME_PROMPT_BAD"
            fi
            # compute PS1
            local git_ps branch untracked dirty py
            if [[ -z "$SIMPLE_PROMPT" ]]; then
                if command -v python &> /dev/null
                then
                    py=" ${blue}顖?$(python --version | sed 's/[[:alpha:]|(|[:space:]]//g')${reset_color}"
                fi
                git rev-parse 2> /dev/null
                if [[ $? -eq 0 ]]; then
                    branch=$(git branch 2>/dev/null | grep '*' | sed 's/* \(.*\)/&/')
                    if [[ -n $(git status -s) ]]; then
                        untracked="${yellow}鈼?{reset_color}"
                    fi
                    git diff --quiet || dirty="${red}鉁?{reset_color}"
                    git_ps=" ${cyan}飷?(${branch}${reset_color}${dirty}${untracked}${cyan})${reset_color}"
                fi
            fi
            PS1="\n${blue}飻?\u ${reset_color}${yellow}顜?\D{}${reset_color}${git_ps}${py}${my_status}${blue}飬?\w\n飦?${normal}"
            PS2="飦?"
        }
        # DOTNET鐨勫浐瀹氶厤缃矾寰?
        export PATH="C:\Users\$USER\.dotnet\tools:$PATH"
        bind '"\C-H":backward-kill-word'
        ```
        </details>

    10. 安装Python和一些工具，修复一些Window问题。

        1. 从 https://conda-forge.org/miniforge/ 安装 miniforge。

            建议加入勾选【将miniforge环境加入路径】的选项，这是为了对抗 Windows 将 Python 设为默认命令的设计失误。按此设置，开发过程能规避很多问题。

            安装完miniforge后，你的默认环境中有 `python` 和 `pip`。

        2. `pip install autojmp`，配合上面的 `.bashrc` 设置，你将能以 `j+模糊地址` 的方式，跳转到以前去过的目录。

    11. 设置初步完成，打开 windows terminal，你现在拥有一个和 Linux 别无二致的终端环境！

        总的来说，你拥有这些东西：

        1. 支持**主要zsh功能**的终端（上下键历史补全，tab 补全，vim/emacs 快捷键，git补全）
        2. **两个包管理器**：scoop (安装 windows 应用) 和 pacman (安装 mingw64 应用)
        3. Linux 命令行工具集

### 常用环境配置


**SSH 和 GitHub:**

1. 生成ssh公私钥: `ssh-keygen -t ed25519`

2. 复制ssh公钥： `cat ~/.ssh/id_ed25519.pub | clip`

3. 打开 https://github.com/settings/keys， 新建 SSH key，key设置为复制结果。

**Emacs 安装:**

- 下面的安装是 Windows 上诸多 Emacs 发行版中唯一可用的那个，它支持 unicode 和纯命令行编辑。

    ```bash
    pacman -S mingw-w64-x86_64-emacs
    ```

**Git设置：**

    ```bash
    # git config --global core.autocrlf false
    # git config --global core.eol lf
    #
    # 对emacs用户
    git config --global core.editor "emacs"
    # 对vscode用户
    git config --global core.editor "code --wait"
    ```

**常用软件及镜像配置：**

```bash

# .net, unity
scoop install dotnet-sdk

# java
scoop bucket add java
scoop install openjdk （重启terminal之后java可以访问）

# LaTeX
scoop install miktex
pacman -S make # latexmk需要make

# pip
pip config set global.index-url https://mirrors.bfsu.edu.cn/pypi/web/simple # 使用北京外国语大学镜像

# conda
# 将~/.condarc设置为北京外国语大学镜像：
channels:
    - https://mirrors.bfsu.edu.cn/anaconda/cloud/conda-forge/
# 如果是非商业/教育版用户、可以直接使用anaconda的商业源，配置方法见：https://mirrors.bfsu.edu.cn/help/anaconda/
```

## 其他

1. 自定义右键菜单，推荐使用这个软件：https://github.com/BluePointLilac/ContextMenuManager

2. Windows 更新后，部分 scoop 应用无法从命令行打开了(`$PATH`被重置)：

    ```bash
    # 修复单个应用
    scoop reset <应用名>
    # 修复所有应用
    scoop reset *
    ```

[^1]: 何为“正确支持”？:在包括但不限于unicode、路径转换、环境变量、二进制依赖等方面与Windows兼容。