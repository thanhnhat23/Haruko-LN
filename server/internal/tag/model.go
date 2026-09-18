package tag

type Tag struct {
	Tag_ID uint   `gorm:"primaryKey"`
	Name   string `gorm:"type:nvarchar(255);not null" validate:"required"`
	Slug   string `gorm:"type:varchar(255)"`
}
