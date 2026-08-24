package volume

type Volume struct {
	volume_id uint `gorm:"primaryKey"`
	post_id   uint
	number    uint
	title     string `gorm:"type:nvarchar(255)"`
	cover     string `gorm:"type:varchar(255)"`
}
