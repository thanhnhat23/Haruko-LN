package icon

type Icon struct {
	icon_id uint   `gorm:"primaryKey"`
	image   string `gorm:"type: varchar(255); not null; index" validate:"required"`
}
