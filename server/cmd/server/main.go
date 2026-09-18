package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/thanhnhat23/Haruko-LN/config"
	"github.com/thanhnhat23/Haruko-LN/internal/auth"
	"github.com/thanhnhat23/Haruko-LN/internal/bookmark"
	"github.com/thanhnhat23/Haruko-LN/internal/chapter"
	"github.com/thanhnhat23/Haruko-LN/internal/chapterimage"
	"github.com/thanhnhat23/Haruko-LN/internal/comment"
	"github.com/thanhnhat23/Haruko-LN/internal/follow"
	"github.com/thanhnhat23/Haruko-LN/internal/icon"
	"github.com/thanhnhat23/Haruko-LN/internal/notification"
	"github.com/thanhnhat23/Haruko-LN/internal/post"
	"github.com/thanhnhat23/Haruko-LN/internal/rating"
	"github.com/thanhnhat23/Haruko-LN/internal/source"
	"github.com/thanhnhat23/Haruko-LN/internal/tag"
	"github.com/thanhnhat23/Haruko-LN/internal/user"
	"github.com/thanhnhat23/Haruko-LN/internal/volume"
	"github.com/thanhnhat23/Haruko-LN/routes"
)

func main() {
	cfg := config.Load()

	db, err := gorm.Open(mysql.Open(cfg.DB.DSN()), &gorm.Config{})
	if err != nil {
		log.Fatalf("không kết nối được database: %v", err)
	}
	if err := db.AutoMigrate(
		&user.User{}, &auth.OAuthAccount{},
		&post.Post{}, &volume.Volume{}, &chapter.Chapter{},
		&chapterimage.ChapterImage{}, &comment.Comment{}, &rating.Rating{},
		&source.Source{}, &tag.Tag{}, &bookmark.Bookmark{}, &follow.Follow{},
		&icon.Icon{}, &notification.Notification{},
	); err != nil {
		log.Fatalf("auto migrate lỗi: %v", err)
	}

	r := gin.Default()
	routes.Register(r, db, cfg)

	log.Printf("server lắng nghe tại :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server dừng: %v", err)
	}
}
