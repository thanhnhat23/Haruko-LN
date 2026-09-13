package chapterimage

import "time"

type IMGTYPE string

const (
	Header = "Header"
	Inline = "Inline"
)

type ChapterImage struct {
	Image_ID   uint `gorm:"primaryKey"`
	Chapter_ID uint `gorm:"not null" validate:"required"`
	Public_ID  uint
	ImgType    IMGTYPE   `gorm:"type:varchar(255)" validate:"required"`
	ImageURL   string    `gorm:"type:varchar(255);not null" validate:"required"`
	OrderIndex int       `gorm:"not null" validate:"required"`
	CreateAt   time.Time `gorm:"autoCreateTime"`
}
