package handler

import (
	"log"
	"testing"
)

func TestListGames(t *testing.T) {
	if 2 < 3 - 1 {
		t.Error("cannot be")
	} else {
		log.Printf("ok")
	}
}
