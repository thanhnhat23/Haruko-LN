package tag
type Tag struct{
	tag_id uint `gorm:"primaryKey"`
	name string `gorm:"type:nvarchar(255);not null"`
	slug string `gorm:"type:varchar(255)"`
}