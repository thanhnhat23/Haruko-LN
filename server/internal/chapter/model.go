package chapter

import (
	"time"

	"github.com/shopspring/decimal"
)

type Chapter struct {
	Chapter_ID    uint            `gorm:"primaryKey"`
	Volume_ID     uint            `gorm:"not null;index" validate:"required"`
	ChapterNumber decimal.Decimal `gorm:"type:decimal(7,2)"`
	Content       string          `gorm:"type:longtext;not null" validate:"required"`
	Title         string          `gorm:"type:nvarchar(255);not null;index" validate:"required"`
	WordCount     uint            `gorm:"default:0"`
	IsLocked      bool            `gorm:"default:false"`
	IsDelete      bool
	OrderIndex    uint
	CreateAt      time.Time `gorm:"autoCreateTime"`
	UpdateAt      time.Time `gorm:"autoUpdateTime"`
}
