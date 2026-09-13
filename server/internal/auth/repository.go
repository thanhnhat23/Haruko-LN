package auth

import (
	"errors"

	"gorm.io/gorm"

	"github.com/thanhnhat23/Haruko-LN/internal/user"

	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
)

const mysqlErrDuplicateEntry = 1062

var ErrDuplicateLink = errors.New("linked")

type Repository struct {
	db *gorm.DB
}
func NewResposity(db *gorm.DB) *Repository{
	return &Repository{db: db}
}
func (r *Repository)FindOAuthAcc(provider, providerUID string) (*OAuthAccount, error){
	var acc OAuthAccount
	err := r.db.Where("provider = ? AND provider_user_id = ?", provider, providerUID).First(&acc).Error
	if (err != nil) {return nil,err};
	return  &acc,nil;
}
func (r *Repository) FindUserByID(ID uuid.UUID) (*user.User, error) {
	var u user.User
	if err := r.db.First(&u, "user_id = ?", ID).Error; err != nil {
		return nil, err
	}
	return &u, nil
}
func (r *Repository) LinkOAuthAcc(acc *OAuthAccount) error{
	err := r.db.Create(acc).Error
	if (isDuplicateEntry(err)){
		return ErrDuplicateLink
	}
	return  err
}
func isDuplicateEntry(err error) bool{
	var mes *mysql.MySQLError
	return errors.As(err, &mes) && mes.Number == mysqlErrDuplicateEntry
}
func (r *Repository) CreateUserWithOAuth(u *user.User, acc *OAuthAccount) error {
	err := r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(u).Error; err != nil {
			return err
		}
		acc.UserID = u.User_ID 
		return tx.Create(acc).Error
	})
	if isDuplicateEntry(err) {
		return ErrDuplicateLink
	}
	return err
}
func (r *Repository) FindUserByEmail(email string) (*user.User, error) {
	var u user.User
	if err := r.db.Where("email = ?", email).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}
