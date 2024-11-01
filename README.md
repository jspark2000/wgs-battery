## Crois Data Preprocessing

### 1. 시스템 요구 사항
poetry, pyenv, node, npm, pnpm 이 설치되어 있어야함

### 2. 실행 방법
**의존성 설치**
```bash

$ ./init.sh

```


**서버 실행**
```bash
$ cd backend
$ uvicorn app.main:app --reload
```


**프론트 실행**
```bash
$ cd frontend
$ pnpm dev
```


**ipynb 출력 삭제 (pre-commit) 설정**
```bash
$ pre-commit install
```
