
echo 'select * from hub' | mysql -uroot -proot simpledns > hub_20170218.csv
echo 'select * from hub_log' | mysql -uroot -proot simpledns > hublog_20170218.csv

mongoimport -d simpledns -c hub --type csv --file hub_20170218.csv --headerline
mongoimport -d simpledns -c hub_log --type csv --file hublog_20170218.csv --headerline