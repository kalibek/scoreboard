package wscontext

import (
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sync"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
}

type Context struct {
	sync.Mutex
	Clients  []*Client
	Upgrader *websocket.Upgrader
}

func NewContext() *Context {
	return &Context{
		Clients: make([]*Client, 0),
		Upgrader: &websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}
}

func (ctx *Context) Notifier(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	c, err := ctx.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("upgrade error: %v\n", err)
		return
	}

	client := &Client{id, c}
	defer client.Conn.Close()

	ctx.Lock()
	ctx.Clients = append(ctx.Clients, client)
	ctx.Unlock()

	log.Printf("client with id %v registered\n", id)

	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read from client with id %v:", id, err)
			break
		}
		log.Printf("recv from client with id %v: %s", id, message)
		err = c.WriteMessage(mt, message)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}
