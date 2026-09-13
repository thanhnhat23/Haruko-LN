package source

type LanguageEnum string

const (
	vi LanguageEnum = "Vietnamese"
	en LanguageEnum = "English"
	jp LanguageEnum = "Japanese"
)

type Source struct {
	Source_ID uint         `gorm:"primaryKey"`
	Post_ID   uint         `gorm:"not null;index" validate:"required"`
	URL       string       `gorm:"type:varchar(255);not null" validate:"required,url"`
	Language  LanguageEnum `gorm:"type:nvarchar(255);not null" validate:"required,oneof=Vietnamese English Japanese"`
	SiteName  string       `gorm:"type:nvarchar(255)"`
}
