package handler

import (
	"fmt"
	"github.com/boltdb/bolt"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/kalibek/scoreboard/pkg/wscontext"
	"io/ioutil"
	"log"
	"net/http"
)

var (
	GameBucket = []byte("games")
)

func ListGames(db *bolt.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		games := make([]string, 0)
		err := db.View(func(tx *bolt.Tx) error {
			// Assume bucket exists and has keys
			b := tx.Bucket(GameBucket)

			c := b.Cursor()

			for k, v := c.First(); k != nil; k, v = c.Next() {
				rec := fmt.Sprintf("%s", v)
				games = append(games, rec)
			}

			w.Write([]byte("["))
			for i, g := range games {
				w.Write([]byte(g))
				if i < len(games)-1 {
					w.Write([]byte(",\n"))
				} else {
					w.Write([]byte("\n"))
				}
			}
			w.Write([]byte("]"))

			return nil
		})
		if err != nil {
			log.Printf("error happended while saving message %v\n", err)
		}
	}
}

func GetGame(db *bolt.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]
		var body []byte
		err := db.View(func(tx *bolt.Tx) error {
			b := tx.Bucket(GameBucket)
			body = b.Get([]byte(id))
			w.Write(body)
			return nil
		})
		if err != nil {
			log.Printf("error happended while saving message %v\n", err)
		}
	}
}

func SaveGame(db *bolt.DB, ctx *wscontext.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Printf("error happended while saving message %v\n", err)
		}
		err = db.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket(GameBucket)
			err = b.Put([]byte(id), body)
			return err
		})
		if err != nil {
			log.Printf("error happended while saving message %v\n", err)
		}
		sendMessage(ctx, id, body)
		w.Write(body)
	}
}

func sendMessage(ctx *wscontext.Context, id string, game []byte) {
	for _, c := range ctx.Clients {
		if c.ID == id {
			err := c.Conn.WriteMessage(websocket.TextMessage, game)
			if err != nil {
				log.Printf("error happended while sending message to client %v\n", err)
			}
		}
	}
}
