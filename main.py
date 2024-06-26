from fastapi import FastAPI, UploadFile, Form, Response # Form 데이터는 "python-multipart"가 필요하기 때문에 설치해줘야 함
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing_extensions import Annotated
import sqlite3

con=sqlite3.connect('db.db', check_same_thread=False) #DB연결
cur=con.cursor()

app = FastAPI()

@app.post('/items')
#image는 UploadFile 형식, title은 form 데이터 형식으로 문자열로 받을 거라는 의미
async def create_item(image:UploadFile,
			title:Annotated[str, Form()],
   			price:Annotated[int, Form()],
    		description:Annotated[str, Form()],
    		place:Annotated[str, Form()],
    		insertAt:Annotated[int, Form()]):
    image_bytes = await image.read() #이미지를 읽는 시간
    cur.execute(f"""
    		   INSERT INTO
               items (title, image, price, description, place, insertAt)
               VALUES ('{title}', '{image_bytes.hex()}', {price}, '{description}','{place}', {insertAt}) 
    		   """) #읽힌 정보를 DB에 insert, f""""""==`${}`
    con.commit()
    
    return '200' # 위의 코드들이 완료가 되면 200이라는 상태코드 리턴


#items라는 get 요청이 들어왔을 때
#Array 형식[1, '식칼팝니다', '잘 잘려요']으로 오는 데이터를 {id:1, title:'식칼팝니다', description:'잘 잘려요'} 객체(object)로 만들어서 FE에 넘겨주기 위한 코드
@app.get('/items')
async def get_items():
	# 컬럼명도 같이 가져옴
    con.row_factory=sqlite3.Row
    
    #DB 가져오면서 connection의 현재 위치를 업데이트
    cur=con.cursor()
    rows = cur.execute(f"""
    				   SELECT * FROM items;
                       """).fetchall() #가져오는 문법이기 때문에 fetchall 작성
    #rows = [['id',1], ['title', '식칼팝니다'],['description','잘 잘려요']]
    
    #rows들 중에 각각의 array를 돌면서 그 array를 dictionary 형태, 즉 객체 형태로 만들어주는 문법
    #dict(row) for row in rows
    
    #dictionary 형태로 자바스크립트 쪽으로 보냄, dict(row) for row in rows를 json 형색으로 바꿔주기 위해 jsonable_encoder로 감싸줌
    return JSONResponse(jsonable_encoder(
    	dict(row) for row in rows
    ))
  
#이미지 가져오기  
@app.get('/images/{item_id}')
def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""SELECT image FROM items WHERE id={item_id}""").fetchone()[0]
    return Response(content=bytes.fromhex(image_bytes))

#회원가입
@app.post("/signup")
def signup(id:Annotated[str,Form()],
           password:Annotated[str,Form()],
           name:Annotated[str,Form()],
           phone:Annotated[str,Form()]):
    cur.execute(f"""
                INSERT INTO users(id,password,name,phone)
                VALUES ('{id}','{password}','{name}','{phone}')
                """)
    con.commit()
    return '200'

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")