package handler

type Player struct {
	Ord  int    `json:"ord"`
	Name string `json:"name"`
}

type Score struct {
	Move  int    `json:"move"`
	Turn  int    `json:"turn"`
	Word  string `json:"word"`
	Score int    `json:"score"`
}

type Game struct {
	GameId  string    `json:"gameId"`
	Players []*Player `json:"players"`
}
