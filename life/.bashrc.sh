export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export PYTHONIOENCODING=utf8
export JULIA_PKG_SERVER="https://mirrors.ustc.edu.cn/julia"
PROMPT_COMMAND="prompt-command"
# cache init
export NODE_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/
export FNM_NODE_DIST_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/
eval "$(fnm env --use-on-cd)"
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
    # 取消下行注释，使用vscode作为git的默认编辑器
    # git config --global core.editor "code --wait"
}
STATUS_THEME_PROMPT_BAD="${bold_red}💢${reset_color}${normal} "
STATUS_THEME_PROMPT_OK="${bold_green}✅${reset_color}${normal} "
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
            py=" ${blue} $(python --version | sed 's/[[:alpha:]|(|[:space:]]//g')${reset_color}"
        fi
        git rev-parse 2> /dev/null
        if [[ $? -eq 0 ]]; then
            branch=$(git branch 2>/dev/null | grep '*' | sed 's/* \(.*\)/\1/')
            if [[ -n $(git status -s) ]]; then
                untracked="${yellow}●${reset_color}"
            fi
            git diff --quiet || dirty="${red}✘${reset_color}"
            git_ps=" ${cyan} (${branch}${reset_color}${dirty}${untracked}${cyan})${reset_color}"
        fi
    fi
    PS1="\n${blue} \u ${reset_color}${yellow} \D{}${reset_color}${git_ps}${py}${my_status}${blue} \w\n ${normal}"
    PS2=" "
}
# DOTNET的固定配置路径
export PATH="C:\Users\$USER\.dotnet\tools:$PATH"
bind '"\C-H":backward-kill-word'