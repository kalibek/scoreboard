package main

import (
	"fmt"
	"github.com/boltdb/bolt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/kalibek/scoreboard/pkg/handler"
	"github.com/kalibek/scoreboard/pkg/wscontext"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	dbFileName := os.Getenv("DB_FILE")
	if dbFileName == "" {
		dbFileName = "game.db"
	}
	db, err := bolt.Open(dbFileName, 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists(handler.GameBucket)
		if err != nil {
			return fmt.Errorf("create bucket if not exists: %s", err)
		}
		return nil
	})

	ctx := wscontext.NewContext()

	router := mux.NewRouter()
	router.HandleFunc("/api/game", handler.ListGames(db)).Methods(http.MethodGet)
	router.HandleFunc("/api/game/{id}", handler.GetGame(db)).Methods(http.MethodGet)
	router.HandleFunc("/api/game/{id}", handler.SaveGame(db, ctx)).Methods(http.MethodPost)
	router.HandleFunc("/ws/stream/{id}", ctx.Notifier)
	router.Use(LoggingMiddleware)

	corsObj := handlers.AllowedOrigins([]string{"*"})
	srv := &http.Server{
		Handler: handlers.CORS(corsObj)(router),
		Addr:    ":8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("server started")
	log.Fatal(srv.ListenAndServe())
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%v %v %v", r.RequestURI, r.Method, r.RemoteAddr)
		next.ServeHTTP(w, r)
	})
}
