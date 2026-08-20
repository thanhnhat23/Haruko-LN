package source
type languageEnum int
const (
	vi languageEnum = iota
	en 
	jp
)
type Source struct{
	scource_id uint `gorm:"primaryKey"`
	post_id uint `gorm:"not null"`
	url string `gorm:"type:varchar(255); not null"`
	language languageEnum `gorm:"int; not null"`
	siteName string `gorm:"nvarchar(255)`
}
