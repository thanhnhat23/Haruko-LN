package chapter

import (
	"time"

	"github.com/shopspring/decimal"
)

type Chapter struct {
	chapter_id    uint            `gorm:"primaryKey"`
	volume_id     uint            `gorm:"not null;index"`
	chapterNumber decimal.Decimal `gorm:"type: decimal(7,2);"`
	content       string          `gorm:"type: longtext;not null;" validate:"required"`
	title         string          `gorm:"type: nvarchar(255); not null; index" validate:"required"`
	wordCount     uint            `gorm:"default:0"`
	isLocked      bool            `gorm:"default:false"`
	orderindex    uint
	createAt      time.Time
	updateAt      time.Time
}
