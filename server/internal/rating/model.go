package rating
type Rating struct{
	rating_id uint `gorm:primaryKey`
	post_id uint `gorm:"not null"`
	score float32 
	review string `gorm:"nvarchar(255)"`
}
