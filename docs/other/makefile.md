---
lang: zh-CN
title: Makefile
description: Makefile
prev: ../network/tcp.md
next: ../template/index.md
search: true
tags:
    - Makefile
    - Golang
---

# Makefile

Makefile 是一个工具，能控制程序的源文件生成可执行文件和非源码文件程序。

[官方文档](https://www.gnu.org/software/make/manual/make.html)

举例子说如何使用一个 Makefile，例子代码如下：

```makefile
BIN_FILE=hello
ORIGIN_FILE=main.go

.PHONY: all build run

all: build

build:
	@go build -o "${BIN_FILE}" "${ORIGIN_FILE}"

run: 
    ./"${BIN_FILE}"
```

声明一个变量使用 变量名=变量值
例如上述代码：
```makefile
BIN_FILE=hello
```
其中声明了一个变量 BIN_FILE 值为 hello
同样的 ORIGIN_FILE 也是一个变量，值为 main.go  

使用 .PHONY: 声明可以使用的指令
```makefile
.PHONY: all build run
```
即声明了 三个指令可以使用 all build run  

指令的具体执行指令在 .PHONY 之后声明
```makefile
all: build

build:
	@go build -o "${BIN_FILE}" "${ORIGIN_FILE}"

run: 
    ./"${BIN_FILE}"
```
使用 指令名称: 其后为指令的具体执行各个子指令
all 为默认执行的指令，即当只输入 make 时执行 all: 中的指令
当没有 all 时，输入 make 不携带targes时，默认执行 .PHONY 后的第一个指令
可以使用 .DEFAULT_GOAL 置顶默认执行的指令

```makefile
.DEFAULT_GOAL := help
```

以下是一个更复杂的例子：
```makefile
GOHOSTOS:=$(shell go env GOHOSTOS)
GOPATH:=$(shell go env GOPATH)
VERSION=$(shell git describe --tags --always)

ifeq ($(GOHOSTOS), windows)
	#the `find.exe` is different from `find` in bash/shell.
	#to see https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/find.
	#changed to use git-bash.exe to run find cli or other cli friendly, caused of every developer has a Git.
	#Git_Bash= $(subst cmd\,bin\bash.exe,$(dir $(shell where git)))
	Git_Bash=$(subst \,/,$(subst cmd\,bin\bash.exe,$(dir $(shell where git))))
	INTERNAL_PROTO_FILES=$(shell $(Git_Bash) -c "find internal -name *.proto")
	API_PROTO_FILES=$(shell $(Git_Bash) -c "find api -name *.proto")
else
	INTERNAL_PROTO_FILES=$(shell find internal -name *.proto)
	API_PROTO_FILES=$(shell find api -name *.proto)
endif

.PHONY: init
# init env
init:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
	go install github.com/go-kratos/kratos/cmd/kratos/v2@latest
	go install github.com/go-kratos/kratos/cmd/protoc-gen-go-http/v2@latest
	go install github.com/google/gnostic/cmd/protoc-gen-openapi@latest
	go install github.com/google/wire/cmd/wire@latest

.PHONY: config
# generate internal proto
config:
	protoc --proto_path=./internal \
	       --proto_path=./third_party \
 	       --go_out=paths=source_relative:./internal \
	       $(INTERNAL_PROTO_FILES)

.PHONY: api
# generate api proto
api:
	protoc --proto_path=./api \
	       --proto_path=./third_party \
 	       --go_out=paths=source_relative:./api \
 	       --go-http_out=paths=source_relative:./api \
 	       --go-grpc_out=paths=source_relative:./api \
	       --openapi_out=fq_schema_naming=true,default_response=false:. \
	       $(API_PROTO_FILES)

.PHONY: build
# build
build:
	mkdir -p bin/ && go build -ldflags "-X main.Version=$(VERSION)" -o ./bin/ ./...

.PHONY: generate
# generate
generate:
	go mod tidy
	go get github.com/google/wire/cmd/wire@latest
	go generate ./...

.PHONY: all
# generate all
all:
	make api;
	make config;
	make generate;

# show help
help:
	@echo ''
	@echo 'Usage:'
	@echo ' make [target]'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
	helpMessage = match(lastLine, /^# (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 2, RLENGTH); \
			printf "\033[36m%-22s\033[0m %s\n", helpCommand,helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help
```