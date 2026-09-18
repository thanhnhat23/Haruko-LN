package icon

type Icon struct {
	Icon_ID uint   `gorm:"primaryKey"`
	Image   string `gorm:"type:varchar(255);not null;index" validate:"required"`
}
